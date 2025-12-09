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
                <tr>
                    <td>1.1.0</td>
                    <td>2025/12/10</td>
                    <td>
                        zipインポート機能を追加
                    </td>
                </tr>
                <tr>
                    <td>1.0.0</td>
                    <td>2024/9/2</td>
                    <td>初回リリース</td>
                </tr>
            </tbody>
        </table>
    </details>
);