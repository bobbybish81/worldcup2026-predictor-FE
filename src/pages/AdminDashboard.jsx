import GroupResults from "./AdminGroupResults";
import KnockoutResults from "./AdminKnockoutResults";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Group Stage Results</h2>
        <GroupResults />
      </section>

      <section>
        <h2>Knockout Results</h2>
        <KnockoutResults />
      </section>
    </div>
  );
}
