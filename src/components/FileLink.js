import { useParams, Link } from "react-router-dom";

import {
    Container,
    Card,
    InputGroup,
    FormControl,
    Button,
} from "react-bootstrap";

export default function FileLink() {
    const { id } = useParams();
    const domain = window.location.host;

    return (
        <>
            <Container className="pt-5 mt-5">
                <Container className="d-flex align-items-center justify-content-center">
                    <Card
                        className="p-4"
                        style={{ midWidth: "400px", maxWidth: "500px" }}
                    >
                        <Card.Title>Upload Successful</Card.Title>
                        <Card.Text>
                            Copy the unique link below to securely share the
                            file with your friends!
                        </Card.Text>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    Unique File Link
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                type="text"
                                value={domain + "/file/" + id}
                                readOnly
                            />
                            <InputGroup.Append>
                                <Button
                                    variant="outline-secondary"
                                    onClick={(e) => {
                                        navigator.clipboard.writeText(
                                            domain + "/file/" + id
                                        );
                                    }}
                                >
                                    Copy!
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <div className="w-100 text-center mt-2">
                            Want to upload another file?{" "}
                            <Link to="/">Return</Link>.
                        </div>
                    </Card>
                </Container>
            </Container>
        </>
    );
}
