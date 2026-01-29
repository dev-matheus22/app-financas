import { db } from "../auth/firebaseConfig.js";
import {
  addDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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


export const editRegister = async (id, uid) => {
  const { success, registers, error } = await getRegisters(uid)
  if (!success) return { success: false, error }
  const item = registers.find(l => l.id === id);
  return item ? { success: true, item } : { success: false, error: "Registro não encontrado" };
}


export const getUid = () => {
  const user = getAuth().currentUser;
  if (!user) {
    console.warn("getUid chamado mas nenhum usuário está logado ainda.");
    return { success: false, error: "Erro ao obter o usuário logado" };
  }
  const uid = user.uid
  return { success: true, uid }
}

export const verifyRegister = (objEmValidacao) => {
  if (!objEmValidacao.valor || isNaN(Number(objEmValidacao.valor)))
    return "Valor inválido";
  if (!objEmValidacao.categoria) return "Categoria inválida";
  if (!objEmValidacao.descricao) return "Descrição inválida";
  if (!objEmValidacao.data) return "Data inválida";
  if (objEmValidacao.tipo !== "entrada" && objEmValidacao.tipo !== "despesa")
    return "Tipo inválido";
  return null;
};

export const saveRegister = async (objInput, id = null) => {
  const erro = verifyRegister(objInput);
  if (erro) {
    return { success: false, error: "Erro ao verificar dados" };
  }

  const { success, uid, error } = getUid();
  if (!success) return { success: false, error }; // aborta se não tem usuário


  if (id === null) {
    try {
      const docRef = await addDoc(collection(db, "registers"), {
        uid,
        valor: objInput.valor,
        categoria: objInput.categoria,
        descricao: objInput.descricao,
        data: objInput.data,
        tipo: objInput.tipo,
        createdAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: "Erro ao salvar o registro" }
    }
  } else {
    try {
      const docRef = doc(db, "registers", id)
      await updateDoc(docRef, {
        valor: objInput.valor,
        categoria: objInput.categoria,
        descricao: objInput.descricao,
        data: objInput.data,
        tipo: objInput.tipo,
        updatedAt: Timestamp.now()
      })
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: "Erro ao salvar o registro" }
    }
  };
}

export const deleteRegister = async (id) => {
  const registerRef = doc(db, "registers", id)
  try {
    await deleteDoc(registerRef)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Erro ao remover registro" }
  }
};

export const getRegisters = async (uid) => {
  const registers = []
  try {
    const q = query(
      collection(db, "registers"),
      where("uid", "==", uid)
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
      registers.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, registers }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Erro ao obter registros" }
  }
}
