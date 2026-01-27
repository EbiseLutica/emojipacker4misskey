import { changeLog } from "../changelog";

export const Changelog: React.FC = () => (
  <details>
    <summary>変更履歴</summary>
    <table className="table table-striped table-sm mt-2">
      <thead>
        <tr>
          <th>バージョン</th>
          <th>日付</th>
          <th>変更内容</th>
        </tr>
      </thead>
      <tbody>
        {changeLog.map((log) => (
          <tr key={log.version}>
            <td>{log.version}</td>
            <td>{log.date}</td>
            <td>
              {typeof log.body === "string" ? (
                log.body
              ) : (
                <ul>
                  {log.body.map((body) => (
                    <li key={body}>{body}</li>
                  ))}
                </ul>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </details>
);
