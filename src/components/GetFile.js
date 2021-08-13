import firebase from "firebase/app";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Container, Card, Button } from "react-bootstrap";

import { store } from "../firebase";
import { useStore } from "../contexts/StoreContext";

export default function GetFile() {
    const { id } = useParams();
    const { getFileURL } = useStore();

    const [fileDoc, setFileDoc] = useState(null);

    function getFileDoc() {
        store
            .collection("files")
            .doc(id)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setFileDoc(doc.data());
                }
            });
    }

    function handleDownload() {
        store
            .collection("files")
            .doc(id)
            .update({
                downloadsLeft: firebase.firestore.FieldValue.increment(-1),
            })
            .then(async () => {
                getFileDoc();
                window.open(await getFileURL(fileDoc.uid));
            });
    }

    useEffect(() => {
        getFileDoc();
    }, []);

    return (
        <>
            <Container className="pt-5 mt-5">
                <Container className="d-flex align-items-center justify-content-center">
                    <Card
                        className="p-4"
                        style={{ minWidth: "400px", maxWidth: "500px" }}
                    >
                        <Card.Title>
                            {fileDoc === null
                                ? "File does not exist."
                                : fileDoc.fileName}
                        </Card.Title>
                        {fileDoc !== null && (
                            <>
                                <p>
                                    Remaining file downloads:{" "}
                                    {fileDoc.downloadsLeft}
                                </p>
                                <Button
                                    className="w-100"
                                    type="submit"
                                    onClick={handleDownload}
                                    disabled={fileDoc.downloadsLeft < 1}
                                >
                                    Download File
                                </Button>
                            </>
                        )}
                    </Card>
                </Container>
            </Container>
        </>
    );
}
