import { useState } from "react";
import { useHistory } from "react-router-dom";

import { Container, Card, Form, Button } from "react-bootstrap";

import { useStore } from "../contexts/StoreContext";

export default function Home() {
    const { uploadFile } = useStore();
    const history = useHistory();

    const [selectedFile, setSelectedFile] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        const newId = await uploadFile(selectedFile);
        history.push("/link/" + newId);
    }

    return (
        <>
            <Container className="pt-5 mt-5">
                <Container className="d-flex align-items-center justify-content-center">
                    <Card
                        className="p-4"
                        style={{ minWidth: "400px", maxWidth: "500px" }}
                    >
                        <Card.Title className="mb-4">Upload File</Card.Title>
                        <Card.Text>
                            Upload a file that you would like to be encrypted
                            and get an unique access link!
                        </Card.Text>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="file" className="mt-4">
                                <Form.Label>File</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) =>
                                        setSelectedFile(e.target.files[0])
                                    }
                                    required
                                />
                            </Form.Group>

                            <Button className="w-100 mt-4" type="submit">
                                Get Link
                            </Button>
                        </Form>
                    </Card>
                </Container>
            </Container>
        </>
    );
}
