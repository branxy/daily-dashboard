import { supabase } from "../../supabaseClient";

function Logout() {
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
  }

  return (
    <button onClick={handleLogout}>
      <span className="material-symbols-outlined">logout</span>
    </button>
  );
}

export default Logout;
