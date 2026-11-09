import { changeLog } from "../changelog";

export const Changelog: React.FC = () => changeLog.map((log) => (
  <section key={log.version}>
    <h4>{log.version} <small className="lu-text-dimmed lu-ms-2">{log.date}</small></h4>
    
    <ul>
      {(typeof log.body === 'string' ? [log.body] : log.body).map((body) => (
        <li key={body}>{body}</li>
      ))}
    </ul>
  </section>
));
