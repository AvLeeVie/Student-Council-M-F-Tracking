const fs = require('fs');
const path = 'src/main.jsx';
const text = fs.readFileSync(path, 'utf8');
const oldBranch = ":types[page]?<Records type={page} txns={txns} students={students} onEdit={x=>setModal({kind:'transaction',type:page,data:x})} onDelete={async x=>{if(confirm('Delete this record?')){await remove('transactions',x.id);refresh();notify('Record deleted.')}}}/>:page==='transactions'?<Transactions txns={txns} onEdit={x=>setModal({kind:'transaction',type:x.type,data:x})}/>:page==='reports'?<Reports stats={stats} txns={txns}/>:<Settings students={students} txns={txns} events={events} saveEvents={saveEvents} refresh={refresh} notify={notify}/>";
const newBranch = ":types[page]?<Records type={page} txns={txns} students={students} onEdit={x=>setModal({kind:'transaction',type:page,data:x})} onDelete={async x=>{if(confirm('Delete this record?')){await remove('transactions',x.id);refresh();notify('Record deleted.')}}}/>:page==='fees'?<Directory title=\"Membership Fees\" items={[[\'sem1\',\'1st Semester Membership Fee\'],[\'sem2\',\'2nd Semester Membership Fee\'],[\'memfine\',\'Membership Fee Fines\']]} setPage={setPage}/>:page==='events'?<Directory title=\"Event Fines\" items={[[\'college\',\'College Event Fine\'],[\'university\',\'University Event Fine\']]} setPage={setPage}/>:page==='transactions'?<Transactions txns={txns} onEdit={x=>setModal({kind:'transaction',type:x.type,data:x})}/>:page==='reports'?<Reports stats={stats} txns={txns}/>:<Settings students={students} txns={txns} events={events} saveEvents={saveEvents} refresh={refresh} notify={notify}/>";
if (!text.includes(oldBranch)) {
  console.error('Old page branch not found.');
  process.exit(1);
}
const branchPat = text.indexOf(oldBranch);
const updated1 = text.replace(oldBranch, newBranch);
const settingsStart = updated1.indexOf("function Settings({students,txns,events,saveEvents,refresh,notify}){const importData=");
const settingsEnd = updated1.indexOf('function Empty({text}){', settingsStart);
if (settingsStart === -1 || settingsEnd === -1) {
  console.error('Could not locate old Settings start or end.');
  process.exit(1);
}
const updated2 = updated1.slice(0, settingsStart) + updated1.slice(settingsEnd);
fs.writeFileSync(path + '.bak', text, 'utf8');
fs.writeFileSync(path, updated2, 'utf8');
console.log('Patched src/main.jsx successfully. Backup saved to src/main.jsx.bak');
