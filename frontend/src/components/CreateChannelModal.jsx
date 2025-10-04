import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useChatUsers } from "../hooks/useChatUsers";
import { useChatContext } from "stream-chat-react";
import toast from "react-hot-toast";
import { AlertCircleIcon, HashIcon, LockIcon, UserIcon, XIcon } from "lucide-react";

const CreateChannelModal = ({ onClose }) => {
  const [formChannelData, setFormChannelData] = useState({
    name: "",
    type: "public",
    description: "",
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [_, setSearchParams] = useSearchParams();
  const { client, setActiveChannel } = useChatContext();
  const { users, loading, error } = useChatUsers(client);
  const [componentError, setComponentError] = useState(null);

  useEffect(() => {
    if (formChannelData.type === "public")
      setSelectedMembers(users.map((u) => u.id));
    else setSelectedMembers([]);
  }, [formChannelData.type, users]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    if (field === "name") {
      setComponentError(validateChannelName(value));
    }
    setFormChannelData((prev) => ({ ...prev, [field]: value }));
  };

  const validateChannelName = (name) => {
    if (!name.trim()) return "Channel name is required";
    if (name.length < 3) return "Channel name must be at least 3 characters";
    if (name.length > 22) return "Channe name must be less than 22 characters";

    return "";
  };

  const handleMemberToggle = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((uid) => uid !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateChannelName(formChannelData.name);
    if (validationError) return setComponentError(validationError);

    if (isCreating || !client?.user) return;

    setIsCreating(true);
    setComponentError("");

    try {
      const channelId = formChannelData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "")
        .slice(0, 20);

      const channelData = {
        name: formChannelData.name.trim(),
        created_by_id: client.user.id,
        members: [client.user.id, ...selectedMembers],
      };

      if (formChannelData.description)
        channelData.description = formChannelData.description;

      if (formChannelData.type === "private") {
        channelData.private = true;
        channelData.visibility = "private";
      } else {
        channelData.visibility = "public";
        channelData.discoverable = true;
      }

      const channel = client.channel("messaging", channelId, channelData);
      await channel.watch();
      setActiveChannel(channel);
      setSearchParams({ channel: channelId });

      toast.success(`Channel "${formChannelData.name}" created successfuly!`);
      onClose();
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="create-channel-modal-overlay">
      <div className="create-channel-modal">
        <div className="create-channel-modal__header">
          <h2>Create a channel</h2>
          <button onClick={onClose} className="create-channel-modal__close">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="create-channel-modal__form">
          {componentError && (
            <div className="form-error">
              <AlertCircleIcon className="w-4 h-4" />
              <span>{componentError}</span>
            </div>
          )}

          {/* name */}
          <div className="form-group">
            <div className="input-with-icon">
              <HashIcon className="w-4 h-4 input-icon" />
              <input
                name="name"
                type="text"
                value={formChannelData.name}
                onChange={handleChange("name")}
                placeholder="e.g. marketing"
                className={`form-input ${
                  componentError ? "from-input--error" : ""
                }`}
                autoFocus
                maxLength={22}
              />
            </div>

            {/* channel id */}
            {formChannelData.name && (
              <div className="form-hint">
                Channel ID will be: #
                {formChannelData.name
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-_]/g, "")}
              </div>
            )}
          </div>

          {/* channel type */}
          <div className="form-group">
            <label>Channel type</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  value="public"
                  checked={formChannelData.type === "public"}
                  onChange={handleChange("type")}
                />

                <div className="radio-content">
                  <HashIcon className="size-4" />
                  <div>
                    <div className="radio-title">Public</div>
                    <div className="radio-description">
                      Anyone can join this channel
                    </div>
                  </div>
                </div>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  value="private"
                  checked={formChannelData.type === "private"}
                  onChange={handleChange("type")}
                />

                <div className="radio-content">
                  <LockIcon className="size-4" />
                  <div>
                    <div className="radio-title">Private</div>
                    <div className="radio-description">
                      Only invited members can join
                    </div>
                  </div>
                </div>
              </label>

            </div>
          </div>

          {/* addmembers */}
          {formChannelData.type === "private" && (
            <div className="form-group">
              <label>Add members</label>
              <div className="member-selection-header">
                <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() => setSelectedMembers(users.map((u) => u.id))}
                disabled= {loading || users.length === 0}>
                  <UserIcon className="size-4"/>
                  Select Everyone
                </button>
                <span className="selected-count">{selectedMembers.length} selected</span>
              </div>

              <div className="members-list">
                {loading ? (
                  <p>Loading users...</p>
                ) : users.length === 0 ? (<p>No users found</p>):(
                  users.map(user => (
                    <label key={user.id} className="member-item">
                      <input
                      type="checkbox"
                      checked={selectedMembers.includes(user.id)}
                      onChange={() => handleMemberToggle(user.id)}
                      className="member-checkbox"/>

                      {user.image ? (
                        <img src={user.image} alt={user.name || user.id} className="member-avatar" />
                      ): (
                        <div className="member-avatar member-avatar-placeholder">
                          <span>{(user.name || user.id).charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <span className="member-name">{user.name || user.id}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* description */}
          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
            id="description"
            value={formChannelData.description}
            onChange={handleChange("description")}
            placeholder="What's this channel about?"
            className="form-textarea"
            rows={3}/>
          </div>

          {/* buttons */}
          <div className="create-channel-modal__actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>

            <button type="submit" disabled={!formChannelData.name.trim || isCreating} className="btn btn-primary">
              {isCreating ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;
