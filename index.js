'use babel'

import {CompositeDisposable} from 'atom'

let subscriptions

export function activate() {
    subscriptions = new CompositeDisposable()
}

export function deactivate() {
    subscriptions.dispose()
}

export function consumeIndie(registerIndie) {
    const linter = registerIndie({name: 'Example'})
    subscriptions.add(linter)

    // Setting and clearing messages per filePath
    subscriptions.add(atom.workspace.observeTextEditors(function(textEditor) {
        const editorPath = textEditor.getPath()
        if (!editorPath) {
            return
        }

        linter.setMessages(editorPath, [
            {
                severity: 'info',
                location: {
                    file: editorPath,
                    position: [
                        [
                            0, 0
                        ],
                        [0, 1]
                    ]
                },
                excerpt: `A random value is ${Math.random()}`,
                description: `### What is this?\nThis is a randomly generated value`
            }
        ])

        const subscription = textEditor.onDidDestroy(function() {
            subscriptions.remove(subscription)
            linter.setMessages(editorPath, [])
        })
        subscriptions.add(subscription)
    })))

    // Setting and replacing all messages
    linter.setAllMessages([
        {
            severity: 'info',
            location: {
                file: '/tmp/test-1.js',
                position: [
                    [
                        5, 0
                    ],
                    [5, 1]
                ]
            },
            excerpt: 'This is an error message on a file'
        }, {
            severity: 'info',
            location: {
                file: '/tmp/test-3.js',
                position: [
                    [
                        5, 0
                    ],
                    [5, 1]
                ]
            },
            excerpt: 'This is an error message on a different file'
        }
    ])

    // Clear all messages
    linter.clearMessages()
}
