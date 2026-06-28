// import Editor from "@monaco-editor/react";

// const CodeEditor = ({ code, setCode, language }) => {

//   return (
//     <Editor
//       height="500px"
//       language={language}
//       theme="vs-dark"
//       value={code}
//       onChange={(value) => setCode(value)}
//     />
//   );
// };

// export default CodeEditor;

import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode, language }) => {

  return (

    <Editor

      height="100%"

      width="100%"

      language={language}

      theme="vs-dark"

      value={code}

      onChange={(value)=>setCode(value)}

      options={{
        automaticLayout:true
      }}

    />

  );

};

export default CodeEditor;