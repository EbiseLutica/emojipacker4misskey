import imageHelp1 from '../assets/help-1.png';

export const Help: React.FC = () => (
    <details>
        <summary>Misskeyへの絵文字パックのインポート方法</summary>
        <ol>
        <li>絵文字パックをダウンロードします。</li>
        <li>Misskeyのカスタム絵文字管理画面を開きます。</li>
        <li>
            [インポート] を選択し、ダウンロードしたパックを選択します。
            <img className="mw-100" src={imageHelp1} alt="Misskeyのカスタム絵文字管理画面" />
        </li>
        </ol>
    </details>
);