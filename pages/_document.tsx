import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {

    render() {
        return (
            <Html lang="ja">
                <Head>
                    <title>rhythmusic</title>
                </Head>
                <body style={{margin: 0}}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
};

export default MyDocument;