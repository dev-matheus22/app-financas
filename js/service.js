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
    return {
      success: true,
      data: { action: "logout" }
    };
  } catch (error) {
    console.error("Erro ao deslogar", error);
    return {
      success: false,
      error: { message: "Erro ao deslogar", code: "AUTH_LOGOUT" }
    };
  }
};

export const editRegister = async (id, uid) => {
  const { success, data, error } = await getRegisters(uid);
  if (!success) return { success: false, error };

  const item = data.registers.find(l => l.id === id);

  return item
    ? { success: true, data: { register: item } }
    : {
        success: false,
        error: { message: "Registro não encontrado", code: "REGISTER_NOT_FOUND" }
      };
};

export const getUid = () => {
  const user = getAuth().currentUser;
  if (!user) {
    return {
      success: false,
      error: { message: "Usuário não autenticado", code: "AUTH_NO_USER" }
    };
  }

  return {
    success: true,
    data: { uid: user.uid }
  };
};

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
    return {
      success: false,
      error: { message: "Erro ao verificar dados", code: "VALIDATION_ERROR" }
    };
  }

  const { success, data, error } = getUid();
  if (!success) return { success: false, error };

  const uid = data.uid;

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

      return {
        success: true,
        data: { id: docRef.id, action: "created" }
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: { message: "Erro ao salvar o registro", code: "FIRESTORE_CREATE" }
      };
    }
  } else {
    try {
      const docRef = doc(db, "registers", id);
      await updateDoc(docRef, {
        valor: objInput.valor,
        categoria: objInput.categoria,
        descricao: objInput.descricao,
        data: objInput.data,
        tipo: objInput.tipo,
        updatedAt: Timestamp.now()
      });

      return {
        success: true,
        data: { id, action: "updated" }
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: { message: "Erro ao salvar o registro", code: "FIRESTORE_UPDATE" }
      };
    }
  }
};

export const deleteRegister = async (id) => {
  const registerRef = doc(db, "registers", id);
  try {
    await deleteDoc(registerRef);
    return {
      success: true,
      data: { id, action: "deleted" }
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: { message: "Erro ao remover registro", code: "FIRESTORE_DELETE" }
    };
  }
};

export const getRegisters = async (uid) => {
  const registers = [];
  try {
    const q = query(
      collection(db, "registers"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      registers.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      data: {
        registers,
        total: registers.length
      }
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: { message: "Erro ao obter registros", code: "FIRESTORE_READ" }
    };
  }
};
