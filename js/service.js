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
import { verifyRegister } from "./validate.js";
import { getUid } from "../auth/auth.js";
import { dataInput } from "./ui.js";


export const getRegister = async (id) => {
  try {
    const docRef = doc(db, "registers", id)

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      let register = docSnap.data()
      return {
        success: true,
        data: {
          id: docSnap.id,
          ...docSnap.data()
        }
      }
    } else {
      return { success: false, error: "Dados não encontrados" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao atualizar registro" }
  }
}

export const updateRegister = async (id, objInput) => {
  const erro = verifyRegister(objInput)
  if (erro) {
    return { success: false, error: "Erro ao verificar dados" };
  }
  const { valor, categoria, descricao, data, tipo } = objInput


  try {
    await updateDoc(doc(db, "registers", id), {
      valor,
      categoria,
      descricao,
      data,
      tipo
    })
    return { success: true, msg: "Registro atualizado com sucesso" }
  } catch (error) {
    console.error(error);
    return { success: false, error }
  }

}


export const createRegister = async (objInput) => {
  const erro = verifyRegister(objInput);
  if (erro) {
    return { success: false, error: "Erro ao verificar dados" };
  }

  const { success, uid, error } = await getUid();
  if (!success) return { success: false, error }; // aborta se não tem usuário


  const { valor, categoria, descricao, data, tipo } = objInput

  try {
    await addDoc(collection(db, "registers"), {
      uid,
      valor,
      categoria,
      descricao,
      data,
      tipo,
      createdAt: Timestamp.now()
    });

    return { success: true, msg: "Registro criado com sucesso" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao salvar o registro" }
  }
}


export const deleteRegister = async (id) => {
  const registerRef = doc(db, "registers", id)
  try {
    await deleteDoc(registerRef)
    return { success: true, msg: "Registro deletado com sucesso" }
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
    return { success: true, data: registers }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Erro ao obter registros" }
  }
}
