import { useState } from "react"
import { CodeEditor } from "./components/code-editor"

function App() {
    const [code, setCode] = useState("")
    return (
        <section className="w-full h-screen pt-12">
            <div className="w-full max-w-4xl mx-auto px-6 lg:px-0">
                <CodeEditor initialValue={code} onChange={setCode} />
            </div>
        </section>
    )
}

export default App
