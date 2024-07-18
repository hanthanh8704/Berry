import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Container, Row, Col, Carousel, Button, Card } from 'react-bootstrap';
import './Home.css'; // Import custom CSS

const HomeClient = () => {
    return (
        <div>
            {/* Slider */}
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://via.placeholder.com/800x400"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://via.placeholder.com/800x400"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://via.placeholder.com/800x400"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <Container className="mt-5">
                {/* Sản phẩm nổi bật */}
                <h1>Sản phẩm nổi bật</h1>
                <Row className="mb-4">
                    {[...Array(4)].map((_, idx) => (
                        <Col key={idx}>
                            <Card className="text-center">
                                <Card.Img variant="top" src="https://via.placeholder.com/200x200" />
                                <Card.Body>
                                    <Button variant="light" className="custom-button">Xem thêm</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Sản phẩm mới */}
                <h1>Sản phẩm mới</h1>
                {[...Array(4)].map((_, idx) => (
                    <Row className="mb-4" key={idx}>
                        {[...Array(5)].map((_, idx) => (
                            <Col key={idx}>
                                <Card className="text-center">
                                    <Card.Img variant="top" src="https://via.placeholder.com/200x200" />
                                    <Card.Body>
                                        <Button variant="light" className="custom-button">Xem thêm</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ))}
            </Container>
        </div>
    );
};

export default HomeClient;
