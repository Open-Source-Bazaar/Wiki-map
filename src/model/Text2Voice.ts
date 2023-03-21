import { autorun, observable } from 'mobx';
import { getVisibleText } from 'web-utility';

import { i18n } from './Translation';

export enum TTSState {
    Clear,
    Speaking,
    Pause
}

export class Text2VoiceModel {
    voice: SpeechSynthesisVoice;

    @observable
    state = TTSState.Clear;

    constructor() {
        autorun(
            () =>
                (this.voice = speechSynthesis
                    .getVoices()
                    .find(({ lang }) => lang === i18n.currentLanguage))
        );
    }

    async speak(text: string) {
        const content = new SpeechSynthesisUtterance(text);

        content.voice = this.voice;

        const result = new Promise((resolve, reject) => {
            content.onend = resolve;
            content.onerror = reject;
        });
        speechSynthesis.speak(content);

        this.state = TTSState.Speaking;

        try {
            await result;
        } catch {
            speechSynthesis.cancel();
        }
        this.state = TTSState.Clear;
    }

    toggle() {
        if (this.state === TTSState.Speaking) {
            speechSynthesis.pause();

            this.state = TTSState.Pause;
        } else {
            speechSynthesis.resume();

            this.state = TTSState.Speaking;
        }
    }

    *walk(range: Range) {
        const walker = document.createNodeIterator(
            range.commonAncestorContainer
        );
        var current: Node;

        while ((current = walker.nextNode())) {
            if (range.intersectsNode(current)) yield current;

            if (current === range.endContainer) break;
        }
    }

    getSelectedText(box: Element) {
        const range = getSelection()?.getRangeAt(0);

        if (
            range &&
            range + '' &&
            (!box || box.contains(range.commonAncestorContainer))
        )
            return [...this.walk(range)]
                .filter(({ nodeType, parentNode }) => {
                    if (nodeType !== 3) return;

                    const { width, height } = (
                        parentNode as Element
                    ).getBoundingClientRect();

                    return width && height;
                })
                .map(({ nodeValue }, index, { length }) =>
                    nodeValue.slice(
                        index === 0 ? range.startOffset : 0,
                        index === length - 1 ? range.endOffset : Infinity
                    )
                )
                .filter(text => text.trim())
                .join('')
                .trim();
    }

    getReadableText(box: Element) {
        try {
            return this.getSelectedText(box);
        } catch {
            return getVisibleText(box);
        }
    }
}

export default new Text2VoiceModel();
