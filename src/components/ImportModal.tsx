import { Modal, ListGroup, Badge } from "react-bootstrap";
import type { Emoji } from "../models/emoji";

interface ImportModalProps {
  show: boolean;
  emojis: Emoji[];
  onHide: () => void;
  onReplace: () => void;
  onAppend: () => void;
}

export const ImportModal = ({
  show,
  emojis,
  onHide,
  onReplace,
  onAppend,
}: ImportModalProps) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>絵文字パックをインポート</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">
          このパックには、<strong>{emojis.length}種の絵文字</strong>
          が含まれています
        </p>
        <div style={{ maxHeight: "300px", overflowY: "auto" }} className="mb-3">
          <ListGroup>
            {emojis.map((emoji, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex align-items-center gap-3"
              >
                <img
                  src={URL.createObjectURL(emoji.file)}
                  alt={emoji.name}
                  style={{
                    width: "32px",
                    height: "32px",
                    objectFit: "contain",
                  }}
                />
                <div className="flex-grow-1">
                  <div className="fw-bold">:{emoji.name}:</div>
                  {emoji.category && (
                    <small className="text-muted">{emoji.category}</small>
                  )}
                  {emoji.tags && (
                    <div>
                      <small className="text-muted">
                        {emoji.tags.split(" ").map((t) => (
                          <Badge bg="secondary" key={t} className="me-1">
                            {t}
                          </Badge>
                        ))}
                      </small>
                    </div>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-danger" onClick={onReplace}>
            現在のリストを破棄してから開く
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onAppend}
          >
            このリストを末尾にくっつける
          </button>
          <button type="button" className="btn btn-secondary" onClick={onHide}>
            やめる
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
