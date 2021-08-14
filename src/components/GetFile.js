import firebase from "firebase/app";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { Container, Card, Button, Form, Alert } from "react-bootstrap";

import { store } from "../firebase";
import { useStore } from "../contexts/StoreContext";

export default function GetFile() {
    const { id } = useParams();

    const { getFileURL } = useStore();

    const [fileDoc, setFileDoc] = useState(null);
    const [error, setError] = useState("");
    const passwordRef = useRef();

    function getFileDoc() {
        store
            .collection("files")
            .doc(id)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setFileDoc(doc.data());
                    console.log(doc.data().password);
                }
            });
    }

    function handleDownload() {
        setError("");
        if (passwordRef.current.value === fileDoc.password) {
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
        } else {
            setError("Incorrect Password");
        }
    }

    useEffect(() => {
        getFileDoc();
    }, []);

    return (
        <>
            <Container className="pt-5 mt-5">
                {error && <Alert variant="danger">{error}</Alert>}
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
                                <Form.Control
                                    type="password"
                                    className="mt-4 mb-4"
                                    placeholder="password"
                                    ref={passwordRef}
                                />
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
