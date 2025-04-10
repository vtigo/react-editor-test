import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { keymap } from '@codemirror/view';
import {oneDark} from '@codemirror/theme-one-dark'

interface CodeEditorProps {
    initialValue: string;
    onChange?: (value: string) => void;
    fontSize?: number
}

function createEditorTheme(fontSize: number) {
    return EditorView.theme({
        "&": {
            height: "100%",
            fontSize: `${fontSize}px`
        },
        ".cm-scroller": {
            overflow: "auto",
            height: "100% !important",
        },
        ".cm-content, .cm-gutter": {
            minHeight: "100%",
        }
    })
}

function CodeEditor({ 
    initialValue = '',
    onChange,
    fontSize = 18,
} : CodeEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const onChangeRef = useRef(onChange)

    // Keep the editor from beeing recreated every time onChange changes, causing focus issues
    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])
    

    useEffect(() => {
        if (!editorRef.current || viewRef.current) return;

        const extensions = [
            lineNumbers(),
            javascript(),
            oneDark,
            createEditorTheme(fontSize),
            syntaxHighlighting(defaultHighlightStyle),
            keymap.of(defaultKeymap),
            EditorView.updateListener.of(update => {
                if (update.changes && onChangeRef.current) {
                    onChangeRef.current(update.state.doc.toString());
                }
            })
        ];

        // Create the editor state
        const state = EditorState.create({
            doc: initialValue,
            extensions
        });

        // Create and mount the editor view
        const view = new EditorView({
            state,
            parent: editorRef.current
        });

        viewRef.current = view;

        // Cleanup function
        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
        };
    }, [])

    useEffect(() => {
        if (!viewRef.current) return;

        const currentContent = viewRef.current.state.doc.toString();

        // Only update if the content is different, and it's not coming from the editor itself
        if (initialValue !== currentContent) {
            viewRef.current.dispatch({
                changes: {
                    from: 0,
                    to: currentContent.length,
                    insert: initialValue
                }
            });
        }
    }, [initialValue]);

    return (
        <div 
            ref={editorRef} 
            className="h-[300px] border border-gray-800 rounded-md overflow-hidden"
        />
    );
}

export { CodeEditor };
