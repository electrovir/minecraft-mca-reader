import {AnyFunction} from '@augment-vir/common';
import {css, defineElementNoInputs, html, listen} from 'element-vir';
import {minecraftVersions} from '../../minecraft-versions';
import {startParsing} from '../../parser/start-parsing';

export const VirApp = defineElementNoInputs({
    tagName: 'vir-app',
    stateInit: {
        progress: undefined as undefined | number,
        workerCount: window.navigator.hardwareConcurrency * 2 - 1,
    },
    styles: css`
        :host {
            display: flex;
            padding: 64px;
        }

        .progress {
            height: 16px;
            width: 200px;
            position: relative;
            box-sizing: border-box;
            border: 1px solid red;
        }

        .inner-div {
            height: 100%;
            box-sizing: border-box;
            background-color: black;
        }
    `,
    renderCallback: ({state, updateState}) => {
        return html`
            ${state.progress == undefined
                ? ''
                : html`
                      <div class="progress">
                          <div class="inner-div" style="width: ${state.progress}%"></div>
                      </div>
                  `}
            <input
                ${listen('change', (event) =>
                    handleFileChange(event, updateState, state.workerCount),
                )}
                type="file"
                id="fileElem"
                multiple
            />
        `;
    },
});

async function handleFileChange(event: Event, updateState: AnyFunction, workerCount: number) {
    const inputElement = event.target as HTMLInputElement;
    const fileList = Array.from(inputElement.files || []);

    if (!fileList.length) {
        throw new Error(`No files were selected`);
    }

    startParsing({
        workerCount,
        mcaFiles: fileList,
        minecraftVersion: minecraftVersions.java[1][19][2],
        worldName: '',
    });
    // console.log('storing...');
    // await mcVirMapDatabase.minecraftWorld.add(newWorld);
    // console.log('stored');
}
