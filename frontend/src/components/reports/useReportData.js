import { useCallback, useEffect, useState } from "react";
import axios from "../../axios";
import { getPresetRange } from "./reportUtils";

/* Fetch several endpoints at once.
   `sources` must be a constant defined OUTSIDE the component:
   [{ key: "labs", url: "/lab", pick: (d) => d.labs }, ...] */
export function useReportData(sources) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    const responses = await Promise.all(sources.map((source) => axios.get(source.url)));
    const next = {};
    sources.forEach((source, index) => {
      next[source.key] = source.pick(responses[index].data) || [];
    });
    return next;
  }, [sources]);

  useEffect(() => {
    let active = true;
    fetchData()
      .then((next) => {
        if (active) setData(next);
      })
      .catch((err) => {
        if (active) {
          setError(err.response?.data?.message || err.response?.data?.msg || "Could not load report data.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchData]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchData());
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.msg || "Could not load report data.");
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  return { data, loading, error, reload };
}

/* Date range with presets. Editing a date manually switches the preset to "custom". */
export function useDateRange(initialPreset = "all") {
  const init = getPresetRange(initialPreset);
  const [preset, setPresetState] = useState(initialPreset);
  const [fromDate, setFromDate] = useState(init.from);
  const [toDate, setToDate] = useState(init.to);

  const setPreset = (id) => {
    const r = getPresetRange(id);
    setPresetState(id);
    setFromDate(r.from);
    setToDate(r.to);
  };
  const setFrom = (v) => {
    setPresetState("custom");
    setFromDate(v);
  };
  const setTo = (v) => {
    setPresetState("custom");
    setToDate(v);
  };

  const label = fromDate || toDate ? `${fromDate || "start"} to ${toDate || "today"}` : "All time";

  return { preset, fromDate, toDate, setPreset, setFrom, setTo, label };
}
