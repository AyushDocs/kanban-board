"use client"
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Modal from "react-modal";
import styl from "./addtodo.module.css";
import useCreateTodo from "@/hooks/useCreateTodo";
Modal.setAppElement("#__next");

const modalStyles: Modal.Styles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        position: "relative",
        inset: "unset",
        width: "400px",
        maxWidth: "90%",
        padding: "20px",
        borderRadius: "8px",
        background: "white",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    },
};

const AddTodo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { error, createTodo, createdTodo, loading } = useCreateTodo();
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const modalProperties: Modal.Props = {
        isOpen,
        onRequestClose: closeModal,
        contentLabel: "Add Todo Modal",
        shouldCloseOnEsc: true,
        shouldCloseOnOverlayClick: true,
        style: modalStyles,
    };

    return (
        <>
            <button onClick={openModal} className={styl.todoButton}>
                <IoMdAdd className={styl.modal_open_btn} />
            </button>
            <Modal {...modalProperties}>
                <h2>Add Todo</h2>

                {createdTodo && (
                    <div className={styl.successBreadcrumb}>
                        Todo added successfully!
                    </div>
                )}
                {!createdTodo && error && (
                    <div className={styl.errorBreadcrumb}>{error}</div>
                )}
                <form onSubmit={createTodo}>
                    <div className={styl.inputGroup}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            required
                            className={styl.input}
                        />
                    </div>
                    <div className={styl.inputGroup}>
                        <textarea
                            name="description"
                            placeholder="Description"
                            required
                            className={styl.textarea}
                        />
                    </div>
                    <div className={styl.inputGroup}>
                        <select name="priority" className={styl.input}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className={styl.inputGroup}>
                        <select name="status" className={styl.input}>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                    <div className={styl.inputGroup}>
                        <label className={styl.label}>Due Date:</label>
                        <input
                            type="date"
                            name="dueDate"
                            className={styl.input}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styl.submitButton}
                    >
                        {loading ? "Adding..." : "Add Todo"}
                    </button>
                </form>
                <button
                    onClick={closeModal}
                    disabled={loading}
                    className={styl.closeButton}
                >
                    Close
                </button>
            </Modal>
        </>
    );
};

export default AddTodo;
