import React, { useContext } from "react";
import { v4 as uuidv4 } from "uuid";

import { store, storage } from "../firebase";

export const StoreContext = React.createContext();

export function useStore() {
    return useContext(StoreContext);
}

export function StoreProvider({ children }) {
    async function uploadFile(file, password, downloadsLeft) {
        const uid = uuidv4() + "." + file.name.split(".").pop();

        storage.ref(uid).put(file);

        const { id } = await store.collection("files").add({
            uid: uid,
            fileName: file.name,
            password: password,
            downloadsLeft: downloadsLeft,
        });

        return id;
    }

    async function getFileURL(fileUid) {
        return await storage.ref(fileUid).getDownloadURL();
    }

    async function deleteFile(fileUid) {
        storage.ref(fileUid).delete();
    }

    const value = {
        uploadFile,
        getFileURL,
        deleteFile,
    };

    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
}
