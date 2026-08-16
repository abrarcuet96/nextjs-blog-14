"use client";

import { useEffect, useRef } from "react";

export default function DeletePostModal({
  post,
  error,
  isPending,
  onCancel,
  onConfirm,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (post && !dialog.open) dialog.showModal();
    if (!post && dialog.open) dialog.close();
  }, [post]);

  function handleCancel(event) {
    if (isPending) {
      event.preventDefault();
      return;
    }

    onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      onCancel={handleCancel}
    >
      <div className="modal-box max-w-md">
        <h2 id="delete-modal-title" className="text-xl font-bold">
          Delete this post?
        </h2>
        <p id="delete-modal-description" className="mt-3 text-base-content/70">
          <strong className="text-base-content">{post?.title}</strong> will be
          permanently deleted. This action cannot be undone.
        </p>

        {error ? (
          <div role="alert" className="alert alert-error mt-4 text-sm">
            {error.message}
          </div>
        ) : null}

        <div className="modal-action">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="btn btn-error"
          >
            {isPending ? "Deleting..." : "Delete post"}
          </button>
        </div>
      </div>
      <button
        type="button"
        aria-label="Close confirmation"
        onClick={onCancel}
        disabled={isPending}
        className="modal-backdrop cursor-default"
      />
    </dialog>
  );
}
