import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import Modal from "react-modal";
import styl from './addtodo.module.css'
Modal.setAppElement("#__next"); // Important for accessibility

const AddTodo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Clear messages when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setError(null);
            setSuccess(null);
        }
    }, [isOpen]);

    const closeModal = () => {
        setIsOpen(false);
    };

    const addTodo = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch("/api/todo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "todo 1",
                    description: "do this",
                }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to add todo");
            }
            setSuccess("Todo added successfully!");
            setTimeout(() => {
                setIsOpen(false);
            }, 1000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)} className={styl.todoButton}>
                <IoMdAdd
                    style={{
                        backgroundColor: "blue",
                        color: "white",
                        fontSize: "30px",
                    }}
                />
            </button>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                shouldCloseOnEsc={true}
                shouldCloseOnOverlayClick={true}
                style={{
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
                }}
            >
                <h2>Hello Modal</h2>
                {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
                <button onClick={addTodo} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Todo'}
                </button>
                <button onClick={closeModal} disabled={loading} style={{ marginLeft: 8 }}>
                    Close
                </button>
            </Modal>
        </>
    );
};

export default AddTodo;
