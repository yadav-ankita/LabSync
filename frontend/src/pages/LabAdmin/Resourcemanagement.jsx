import { TopBar } from '../../components/TopBar';

import { AddResourceForm } from "./Addresourceform";

export function ResourceManagement() {
 
  return (
    <div>
      <TopBar title="Resource Management" subtitle="Add, update, or remove equipment across all laboratories." 
         rightTop="Lab Administrator" rightBottom="Computer Engineering"
      />
      <AddResourceForm />
    </div>
  );
}