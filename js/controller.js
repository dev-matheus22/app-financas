import { cleanForm, dataInput, showScreen, getNewData } from "./ui.js"
import { getUid } from "../auth/auth.js";
import { createRegister, updateRegister, deleteRegister, getRegister, getRegisters } from "./service";

const getRegisterController = async (id) => {
    const register = await getRegister(id)
    return register
}

const getRegistersController = async () => {
    const uid = await uidController()
    const registers = await getRegisters(uid)
    return registers
}

const uidController = async () => {
    const { success: uidSuccess, uid, error: uidError } = await getUid();
    return uid
}



const createAction = async () => {
    const objInput = await dataInput()
    const { success: uidSuccess, uid, error: uidError } = await getUid();
    if (!uidSuccess) {
        alert(uidError);
        return;
    }

    const result = await createRegister(objInput);
    if (result.success === false) {
        return { success: false, error: result.error };
    } else {
        cleanForm();
        idEmEdicao = null;
        await refreshUI(uid);
        showScreen("lista");
    }
    return result;
};

const updateAction = async (idEmEdicao, objInput) => {
    const { uid, success } = await getUid()

    if (!idEmEdicao) return

    if (!uid) return

    const result = await updateRegister(idEmEdicao, objInput)

    if (result.success) {
        idEmEdicao = null
        await refreshUI(uid)
    } else {
        return { success: false, error: "Erro ao atualizar registro" }
    }

    showScreen("lista")
}

const removeAction = async (lancamentoId) => {
    const { uid, success } = await getUid()

    const result = await deleteRegister(lancamentoId);

    if (!result.success) return alert(result.error);
    
    await refreshUI(uid);
}

export { createAction, updateAction, removeAction }