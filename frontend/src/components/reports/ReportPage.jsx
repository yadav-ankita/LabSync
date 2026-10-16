import { TopBar } from "../TopBar";
import { ReportFilters, SummaryCards, InsightBanner } from "./ReportParts";
import { ReportTable } from "./ReportTable";
import { exportCsv } from "./reportUtils";

/* One shell for every report screen. Role pages only supply data + columns. */
export function ReportPage({
  title, subtitle, rightTop, rightBottom,
  tabs, activeTab, onTab,
  range, showDates = true,
  search, onSearch, searchPlaceholder,
  extraFilters,
  summary = [], insight,
  tableTitle, columns, rows, loading, error, onRowClick,
  exportName, generatedBy,
}) {
  const stamp = new Date().toISOString().slice(0, 10);

  const handleCsv = () => exportCsv(columns, rows, `${exportName}-${stamp}.csv`);
  const handlePdf = async () => {
    const { exportPdf } = await import("./exportPdf");
    exportPdf({
      title: tableTitle,
      rangeLabel: showDates && range ? range.label : "Current records",
      columns,
      rows,
      summary,
      generatedBy,
      filename: `${exportName}-${stamp}.pdf`,
    });
  };

  return (
    <div>
      {/* hide navigation chrome when printing */}
      <style>{`@media print { .no-print, aside, nav { display: none !important; } main { padding: 0 !important; } }`}</style>

      <TopBar title={title} subtitle={subtitle} rightTop={rightTop} rightBottom={rightBottom} />

      {tabs && (
        <div role="tablist" className="inline-flex rounded-lg border bg-white p-1 mb-5 no-print" style={{ borderColor: "#D8DCD4" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onTab(tab.id)}
              className="px-4 py-2 rounded-md text-sm font-medium"
              style={{
                backgroundColor: activeTab === tab.id ? "#1F2A24" : "transparent",
                color: activeTab === tab.id ? "white" : "#5B6A5F",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <ReportFilters
        range={range}
        showDates={showDates}
        search={search}
        onSearch={onSearch}
        searchPlaceholder={searchPlaceholder}
        extra={extraFilters}
        onCsv={handleCsv}
        onPdf={handlePdf}
        onPrint={() => window.print()}
        exportDisabled={loading || rows.length === 0}
      />

      {!loading && !error && (
        <>
          <SummaryCards items={summary} />
          <InsightBanner text={insight} />
        </>
      )}

      <ReportTable
        title={tableTitle}
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        onRowClick={onRowClick}
      />
    </div>
  );
}
