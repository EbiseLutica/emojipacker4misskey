import imageHelp1 from "../assets/help-1.png";

export const HowToImport: React.FC = () => (
  <ol>
    <li>絵文字パックをダウンロードします。</li>
    <li>Misskeyのカスタム絵文字管理画面を開きます。</li>
    <li>
      <code>インポート</code> を選択し、ダウンロードしたパックを選択します。
      <img
        style={{ maxWidth: "100%", height: "auto" }}
        src={imageHelp1}
        width={863}
        height={196}
        alt="Misskeyのカスタム絵文字管理画面"
      />
    </li>
  </ol>
);
