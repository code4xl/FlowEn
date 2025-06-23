import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Puzzle, Copy, ChevronDown } from "lucide-react";

const ToolNode = ({ id, data, isConnectable, onCopyApiKeyToAllToolNodes }) => {
  const [showDropdown, setShowDropdown] = useState(null);
  const isReadOnly = data?.readOnly || false;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newData = { [name]: value };

    // Handle tool selection change to update available actions
    if (name === "selectedTool") {
      const toolActionsField = data.template?.required?.find(
        (f) => f.name === "toolActions"
      );
      if (
        toolActionsField?.optionsByTool &&
        toolActionsField.optionsByTool[value]
      ) {
        newData.toolActions = "";
      }
    }

    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, newData);
    }
  };

  const handleMultiSelectChange = (fieldName, option, isChecked) => {
    const currentValues = data[fieldName] || [];
    let newValues;

    if (isChecked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter((item) => item !== option);
    }

    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { [fieldName]: newValues });
    }
  };

  const renderField = (field, index) => {
    const fieldValue =
      data[field.name] || (field.type === "multi-select" ? [] : "");

    switch (field.type) {
      case "dropdown":
        let options = field.options || [];

        // Handle dynamic options based on selected tool
        if (
          field.name === "toolActions" &&
          field.optionsByTool &&
          data.selectedTool
        ) {
          options = field.optionsByTool[data.selectedTool] || [];
        }

        return (
          <div key={index} style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              {field.label}
            </label>
            <select
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-primary)",
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                borderRadius: "0.375rem",
                outline: "none",
                cursor: "pointer",
              }}
              className="focus:ring-1 focus:ring-[var(--accent-color)]"
            >
              <option value="">Select {field.label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "multi-select":
        let multiOptions = field.options || [];

        // Handle dynamic options based on selected tool
        if (
          field.name === "availableTools" &&
          field.optionsByTool &&
          data.selectedTool
        ) {
          multiOptions = field.optionsByTool[data.selectedTool] || [];
        }

        return (
          <div key={index} style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              {field.label}
            </label>
            <div style={{ position: "relative" }}>
              <div
                onClick={() =>
                  setShowDropdown(
                    showDropdown === field.name ? null : field.name
                  )
                }
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color:
                    fieldValue.length > 0
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                  outline: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                className="hover:border-[var(--accent-color)] transition-colors"
              >
                <span>
                  {fieldValue.length > 0
                    ? `${fieldValue.length} selected`
                    : `Select ${field.label}`}
                </span>
                <ChevronDown size={16} />
              </div>

              {showDropdown === field.name && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.375rem",
                    boxShadow: "var(--shadow-color) 0 4px 12px",
                    zIndex: 1000,
                    maxHeight: "150px",
                    overflowY: "auto",
                    marginTop: "2px",
                  }}
                >
                  {multiOptions.map((option) => (
                    <div
                      key={option}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                      className="hover:bg-[var(--highlight-color)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        const isChecked = !fieldValue.includes(option);
                        handleMultiSelectChange(field.name, option, isChecked);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={fieldValue.includes(option)}
                        readOnly
                        style={{ margin: 0 }}
                      />
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Show selected items */}
            {fieldValue.length > 0 && (
              <div
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.25rem",
                }}
              >
                {fieldValue.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.25rem 0.5rem",
                      background: "var(--accent-color)",
                      color: "white",
                      borderRadius: "9999px",
                      fontSize: "0.7rem",
                    }}
                  >
                    {item}
                    <button
                      onClick={() =>
                        handleMultiSelectChange(field.name, item, false)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: 0,
                        lineHeight: 1,
                        fontSize: "0.8rem",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "action-picker":
        // Similar to dropdown but with special handling for tool actions
        let actionOptions = [];
        if (field.optionsByTool && data.selectedTool) {
          actionOptions = field.optionsByTool[data.selectedTool] || [];
        }

        return (
          <div key={index} style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              {field.label}
            </label>
            <select
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              disabled={!data.selectedTool}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-primary)",
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                borderRadius: "0.375rem",
                outline: "none",
                cursor: "pointer",
                opacity: !data.selectedTool ? 0.5 : 1,
              }}
              className="focus:ring-1 focus:ring-[var(--accent-color)]"
            >
              <option value="">Select Action</option>
              {actionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "boolean":
        return (
          <div key={index} style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name={field.name}
                checked={fieldValue || false}
                onChange={(e) => {
                  if (data.onNodeDataChange) {
                    data.onNodeDataChange(id, {
                      [field.name]: e.target.checked,
                    });
                  }
                }}
                style={{ margin: 0 }}
              />
              {field.label}
            </label>
          </div>
        );

      case "password":
        return (
          <div key={index} style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              {field.label}
            </label>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              <input
                type="password"
                name={field.name}
                value={fieldValue}
                onChange={handleInputChange}
                onPaste={(e) => e.stopPropagation()}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                  outline: "none",
                }}
                className="focus:ring-1 focus:ring-[var(--accent-color)]"
                placeholder={
                  field.placeholder || `Enter ${field.label.toLowerCase()}...`
                }
              />
              {fieldValue &&
                onCopyApiKeyToAllToolNodes &&
                field.name.toLowerCase().includes("apikey") && (
                  <button
                    type="button"
                    title="Copy API Key to all Tool Nodes"
                    style={{
                      padding: "0.5rem",
                      background: "var(--highlight-color)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      color: "var(--text-primary)",
                    }}
                    className="hover:bg-[var(--accent-color)] hover:text-white transition-colors"
                    onClick={() => onCopyApiKeyToAllToolNodes(fieldValue)}
                  >
                    <Copy size={14} />
                  </button>
                )}
            </div>
          </div>
        );

      default:
        return (
          <div key={index} style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
              }}
            >
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              onPaste={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-primary)",
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                borderRadius: "0.375rem",
                outline: "none",
              }}
              className="focus:ring-1 focus:ring-[var(--accent-color)]"
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}...`
              }
            />
          </div>
        );
    }
  };

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "0.5rem",
        boxShadow: "var(--shadow-color) 0 4px 24px -1px",
        width: data.width || 300,
        maxWidth: 400,
        color: "var(--text-primary)",
        fontSize: "0.85rem",
        minHeight: 250,
      }}
    >
      <div
        style={{
          padding: "0.75rem",
          borderBottom: "1px solid var(--border-color)",
          background: "var(--highlight-color)",
          borderRadius: "0.5rem 0.5rem 0 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <Puzzle size={16} style={{ color: "var(--accent-color)" }} />
          <input
            type="text"
            name="label"
            value={data.label || "Tool Node"}
            onChange={handleInputChange}
            onPaste={(e) => e.stopPropagation()}
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              background: "transparent",
              outline: "none",
              border: "none",
              flex: 1,
              padding: "0.25rem",
            }}
            className="focus:ring-1 focus:ring-[var(--accent-color)] rounded"
            placeholder="Node Label"
          />
        </div>
      </div>
      <div
        style={{
          padding: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {isReadOnly ? (
          // Show saved data in readOnly mode
          <>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                Available Tools
              </label>
              <div
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                }}
              >
                {Array.isArray(data.availableTools) &&
                data.availableTools.length > 0
                  ? data.availableTools.join(", ")
                  : "No tools selected"}
              </div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                Selected Tool
              </label>
              <div
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                }}
              >
                {data.selectedTool || "Not specified"}
              </div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                Tool Actions
              </label>
              <div
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                }}
              >
                {data.toolActions || "No actions specified"}
              </div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                API Key
              </label>
              <div
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                }}
              >
                {data.toolApiKey ? "••••••••••••••••" : "Not configured"}
              </div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                }}
              >
                <input
                  type="checkbox"
                  checked={data.accountLinkRequired || false}
                  readOnly
                  style={{ margin: 0 }}
                />
                Account Link Required
              </label>
            </div>
          </>
        ) : (
          // Original editable fields for builder mode
          data.template?.required?.map((field, index) =>
            renderField(field, index)
          )
        )}
      </div>
      {/* <div
        style={{
          padding: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {data.template?.required?.map((field, index) =>
          renderField(field, index)
        )}
      </div> */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        isConnectable={isConnectable}
        style={{
          background: "var(--accent-color)",
          width: "0.75rem",
          height: "0.75rem",
          border: "2px solid var(--card-bg)",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={isConnectable}
        style={{
          background: "var(--accent-color)",
          width: "0.75rem",
          height: "0.75rem",
          border: "2px solid var(--card-bg)",
        }}
      />
    </div>
  );
};

export default memo(ToolNode);
