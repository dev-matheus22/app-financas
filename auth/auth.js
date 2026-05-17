import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const logout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log("User signed out successfully!");
    return { success: true }
  } catch (error) {
    console.error("Erro ao deslogar", error);
    return { success: false, error: "Erro ao deslogar" }
  }
};

export const getUid = () => {
  const user = getAuth().currentUser;
  if (!user) {
    console.warn("getUid chamado mas nenhum usuário está logado ainda.");
    return { success: false, error: "Erro ao obter o usuário logado" };
  }
  const uid = user.uid
  return { success: true, uid }
}