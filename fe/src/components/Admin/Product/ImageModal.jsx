import { Empty, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import swal from "sweetalert";
import * as request from "views/utilities/httpRequest";
import { IconPhotoFilled } from "@tabler/icons-react";
import 'bootstrap/dist/css/bootstrap.min.css';

function ImageModal({ colorName, sttModal, handleChange }) {
    const [selectedImages, setSelectedImages] = useState([]);
    const [listImage, setListImage] = useState([]);
    const [loading, setLoading] = useState(false); // State for loading indicator

    useEffect(() => {
        loadImage(colorName);
    }, [colorName]);

    const loadImage = (colorFolder) => {
        request.get(`/image-gallery/${colorFolder}`).then((response) => {
            setListImage(response);
        }).catch((e) => {
            console.log(e);
        });
    }

    const handleImageSelect = (event) => {

        const imageUrl = event.target.value;
        if (event.target.checked) {
            if (selectedImages.length >= 3) {
                toast.error("Chỉ được chọn tối đa 3 hình ảnh!");
                event.target.checked = false;
            } else {
                setSelectedImages((prevSelectedImages) => [
                    ...prevSelectedImages,
                    imageUrl,
                ]);
            }
        } else {
            setSelectedImages((prevSelectedImages) =>
                prevSelectedImages.filter((url) => url !== imageUrl)
            );
        }
    };
    useEffect(() => {
        handleChange(colorName, sttModal, selectedImages);

    }, [selectedImages]);

    const handleUploadImage = (event) => {
        const fileList = event.target.files;
        const formData = new FormData();
        let validImages = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            if (file.type.startsWith("image/")) {
                formData.append("images", file);
                validImages.push(file);
            } else {
                toast.error(`Tệp ${file.name} không phải là ảnh và sẽ không được thêm.`);
            }
        }
        if (validImages.length > 0) {
            swal({
                title: `Xác nhận thêm ${validImages.length} ảnh ?`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    setLoading(true); // Set loading state to true when uploading
                    formData.append("folder", colorName);
                    await request.post('/image-gallery', formData, { headers: { "Content-Type": "multipart/form-data" } })
                        .then(response => {
                            toast.success("Thêm thành công!");
                            loadImage(colorName);
                        })
                        .catch(e => {
                            console.log(e);
                        })
                        .finally(() => {
                            setLoading(false); // Set loading state to false when done
                        });
                }
            });
        } else {
            toast.error("Không tìm thấy ảnh hợp lệ!");
        }
    }

    return (
        <>
            <button
                type="button"
                className="btn border-0 btn-sm"
                data-bs-toggle="modal"
                data-bs-target={`#exampleModal${sttModal}`}
            >
                <IconPhotoFilled />
            </button>

            <div
                className="modal fade modal-lg"
                id={`exampleModal${sttModal}`}
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Chọn hình ảnh
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="">
                                <h6>Danh sách ảnh của sản phẩm</h6>
                                <div className="row overflow-auto text-center">
                                    {selectedImages.length === 0 ? (
                                        <div className="container">
                                            <Empty />
                                        </div>
                                    ) : (
                                        selectedImages.map((image, index) => (
                                            <div className="col-xl-2 position-relative" key={index}>
                                                <img
                                                    src={image}
                                                    alt="img"
                                                    width={"100%"}
                                                    height={150}
                                                    className="object-fit-lg-scale border border-1 mb-3"
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="">
                                <div className="d-flex align-items-center my-3">
                                    <div className="flex-grow-1">
                                        <h6>Danh sách ảnh các sản phẩm màu {colorName.toLowerCase()}</h6>
                                    </div>
                                    <div className="">
                                        <button
                                            className="position-relative d-flex align-items-center 
                                            justify-content-center btn btn-primary btn-sm"
                                            style={{ backgroundColor: '#5e35b1' }}
                                        >
                                            <i className="fas fa-plus"></i> Thêm ảnh vào hệ thống
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="position-absolute opacity-0"
                                                style={{ width: "100%", height: "100%" }}
                                                onChange={(event) => handleUploadImage(event)}
                                            />
                                        </button>
                                    </div>
                                </div>
                                {loading ? (
                                    <div className="text-center my-4">
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <div
                                        className="row overflow-auto text-center"
                                        style={{ height: "250px" }}
                                    >
                                        {listImage.map((image, index) => (
                                            <div className="col-xl-2 position-relative" key={index}>
                                                <label htmlFor={`check${sttModal}Img${index}`}>
                                                    <img
                                                        src={image.url}
                                                        alt="img"
                                                        width={"100%"}
                                                        height={150}
                                                        className="object-fit-lg-scale border border-1 mb-3"
                                                    />
                                                </label>
                                                <div className="position-absolute top-0">
                                                    <input
                                                        type="checkbox"
                                                        id={`check${sttModal}Img${index}`}
                                                        name="imageSelect"
                                                        value={image.url}
                                                        onChange={handleImageSelect}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ImageModal;
