import React from "react";
import VoidEditor from "void-editor";

const VoidEditorComponent = ({ content, onSave }) => {
    const handleSave = (newContent) => {
        onSave(newContent);
    };

    return (
        <div className="void-editor-container">
            <VoidEditor
                initialContent={content || ""}
                onSave={handleSave}
                options={{
                    autofocus: true,
                    placeholder: "Start typing...",
                    toolbar: ["bold", "italic", "code", "link"],
                }}
            />
        </div>
    );
};

export default VoidEditorComponent;
