// resources/js/components/TextEditor.tsx

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Undo2, Redo2, Quote, Minus, Link as LinkIcon, Unlink
} from 'lucide-react';
import React, { useState, useCallback } from 'react';

interface TextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    error?: string;
    label?: string;
    required?: boolean;
}

const MenuButton = ({
    onClick,
    isActive = false,
    children,
    title
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-1.5 rounded text-xs transition
            ${isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }
            cursor-pointer
        `}
    >
        {children}
    </button>
);

const Divider = () => (
    <div className="w-[1px] h-5 bg-slate-200 mx-0.5"></div>
);

export default function TextEditor({
    content,
    onChange,
    placeholder = 'متن مکتوب را اینجا بنویسید...',
    error,
    label,
    required = false
}: TextEditorProps) {

    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: 'list-disc list-inside',
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'list-decimal list-inside',
                },
            }),
            ListItem,
            Placeholder.configure({
                placeholder: placeholder,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['right', 'center', 'left', 'justify'],
                defaultAlignment: 'right',
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
                },
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[250px] px-4 py-3 text-sm leading-relaxed',
                dir: 'rtl',
            },
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;

        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setShowLinkInput(false);
            return;
        }

        // اضافه کردن پروتکل اگر وجود نداشته باشه
        let url = linkUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        setShowLinkInput(false);
        setLinkUrl('');
    }, [editor, linkUrl]);

    const removeLink = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }, [editor]);

    const openLinkInput = useCallback(() => {
        if (!editor) return;

        // اگر متنی انتخاب شده یا لینکی فعاله
        const previousUrl = editor.getAttributes('link').href;
        setLinkUrl(previousUrl || '');
        setShowLinkInput(true);
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div>
            {label && (
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 mr-1">*</span>}
                </label>
            )}

            <div className={`border rounded-md overflow-hidden bg-white transition
                ${error ? 'border-red-300 ring-1 ring-red-500' : 'border-slate-300 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500'}
            `}>
                {/* Toolbar */}
                <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50/80 flex-wrap">
                    {/* Undo/Redo */}
                    <MenuButton onClick={() => editor.chain().focus().undo().run()} title="برگشت">
                        <Undo2 className="h-3.5 w-3.5" />
                    </MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().redo().run()} title="بازگشت">
                        <Redo2 className="h-3.5 w-3.5" />
                    </MenuButton>

                    <Divider />

                    {/* Bold/Italic/Underline/Strike */}
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="پررنگ"
                    >
                        <Bold className="h-3.5 w-3.5" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="کج"
                    >
                        <Italic className="h-3.5 w-3.5" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="زیرخط"
                    >
                        <UnderlineIcon className="h-3.5 w-3.5" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="خط‌خورده"
                    >
                        <Strikethrough className="h-3.5 w-3.5" />
                    </MenuButton>

                    <Divider />

                    {/* Link */}
                    <MenuButton
                        onClick={openLinkInput}
                        isActive={editor.isActive('link')}
                        title="افزودن لینک"
                    >
                        <LinkIcon className="h-3.5 w-3.5" />
                    </MenuButton>
                    {editor.isActive('link') && (
                        <MenuButton
                            onClick={removeLink}
                            title="حذف لینک"
                        >
                            <Unlink className="h-3.5 w-3.5 text-red-500" />
                        </MenuButton>
                    )}

                    <Divider />

                    {/* Lists */}
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="لیست"
                    >
                        <List className="h-3.5 w-3.5" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="لیست شماره‌دار"
                    >
                        <ListOrdered className="h-3.5 w-3.5" />
                    </MenuButton>

                    <Divider />

                    {/* Alignment */}
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="راست‌چین"
                    >
                        <AlignRight className="h-3.5 w-3.5" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="وسط‌چین"
                    >
                        <AlignCenter className="h-3.5 w-3.5" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="چپ‌چین"
                    >
                        <AlignLeft className="h-3.5 w-3.5" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        title="تراز"
                    >
                        <AlignJustify className="h-3.5 w-3.5" />
                    </MenuButton>

                    <Divider />

                    {/* Blockquote & Horizontal Rule */}
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="نقل قول"
                    >
                        <Quote className="h-3.5 w-3.5" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="خط افقی"
                    >
                        <Minus className="h-3.5 w-3.5" />
                    </MenuButton>
                </div>

                {/* Link Input Dialog */}
                {showLinkInput && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-200">
                        <LinkIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <input
                            type="text"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="آدرس لینک را وارد کنید..."
                            className="flex-1 border border-blue-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setLink();
                                }
                                if (e.key === 'Escape') {
                                    setShowLinkInput(false);
                                    setLinkUrl('');
                                }
                            }}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={setLink}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                        >
                            تأیید
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowLinkInput(false);
                                setLinkUrl('');
                            }}
                            className="px-3 py-1 text-slate-600 hover:text-slate-800 text-xs"
                        >
                            لغوه
                        </button>
                    </div>
                )}

                {/* Editor Area */}
                <EditorContent editor={editor} />
            </div>

            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
}