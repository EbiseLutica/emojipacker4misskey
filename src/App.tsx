import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import type { FormValues } from './models/form-values';
import { SectionList } from './components/SectionList';
import { makeZip } from './services/make-zip';

import './App.scss';

function App() {
  const methods = useForm<FormValues>();

  const onValid: SubmitHandler<FormValues> = async ({ emojis }) => {
    const zippedBlob = await makeZip(emojis);
    const url = URL.createObjectURL(zippedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emojis.zip';
    a.click();
  };

  return (
    <div>
      <main className="ep-root p-5 bg-white rounded-5 my-5 shadow">
        <header>
          <h1>Emoji Packer for Misskey</h1>
          <ul>
            <li>
              複数の絵文字画像を、Misskeyで使える絵文字インポート用のzipファイルに変換するサービスです。
            </li>
            <li>Misskey 2024.8.0 で動作確認しています。</li>
            <li>
              お使いの端末だけで動作するため、アップロードした画像や入力値は、特定のサーバー等には一切送信されません。
            </li>
            <li>
              なにか不具合がありましたら、
              <a href="https://mk.shrimpia.network/@Lutica">
                @Lutica@mk.shrimpia.network
              </a>
              まで。
            </li>
          </ul>
        </header>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onValid)}>
            <SectionList />
            <button
              type="submit"
              className="btn btn-primary d-block mt-5 mx-auto px-5 fs-5"
            >
              絵文字パックを生成
            </button>
          </form>
        </FormProvider>
      </main>
      <footer className="text-center my-5 text-muted">
        (C) 2024 Shrimpia Network
      </footer>
    </div>
  );
}

export default App;
