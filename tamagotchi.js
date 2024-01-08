const Margo = document.querySelector('.Margo');

const poop = {
    elem: document.querySelector('.poop'),

    scoreDisplay: document.querySelector('.chore-score'),

    cleaned: 0,

    isPlayerThought() {
        poop.scoreDisplay.classList.add('is-player-thought');
    },

    notPlayerThought() {
        poop.scoreDisplay.classList.remove('is-player-thought');
    },

    show() {
        if (false === Margo.classList.contains('has-pooped')) {
            poop.elem.classList.add('is-visible');
            Margo.classList.add('has-pooped');
        }
    },

    hide() {
        poop.elem.classList.remove('is-visible');
        Margo.classList.remove('has-pooped');
    },

    clean() {
        let message;

        if (Margo.classList.contains('has-pooped')) {
            poop.hide();
            poop.cleaned++;

            switch (poop.cleaned) {
                case 1:
                    poop.notPlayerThought();
                    message = `You've cleaned ${poop.cleaned} poop`;
                    break;
                case 3:
                    poop.isPlayerThought();
                    message = `"...what do they feed theese things..."`;
                    break;
                case 7:
                    poop.isPlayerThought();
                    message = `"...this is getting mildly annoying..."`;
                    break;
                case 9:
                    poop.isPlayerThought();
                    message = `"...I can't believe I'm still here..."`;
                    break;
                case 13:
                    poop.isPlayerThought();
                    message = `"...omg just make it stop already..."`;
                    break;
                case 16:
                    poop.isPlayerThought();
                    message = `"...You've cleaned 16 brain cells..."`;
                    break;
                case 18:
                    poop.isPlayerThought();
                    message = `"...maybe if I just don't bother..."`;
                    break;
                case 19:
                    poop.isPlayerThought();
                    message = `"...NO. I must go on..."`;
                    break;
                case 23:
                    poop.isPlayerThought();
                    message = `"...what am I doing with my time..."`;
                    break;
                case 26:
                    poop.isPlayerThought();
                    message = `"...what time is it even..."`;
                    break;
                case 27:
                    const d = new Date();
                    const h = d.getHours();
                    const m = d.getMinutes();

                    poop.isPlayerThought();
                    message = `"...oh, just ${h}:${m}..."`;
                    break;
                case 28:
                    poop.isPlayerThought();
                    message = `"...might as well keep going..."`;
                    break;
                case 31:
                    poop.isPlayerThought();
                    message = `"...but <b>why</b> keep going..."`;
                    break;
                case 33:
                    poop.isPLayerThought();
                    message = `"...why keep going <b>at all</b>..."`;
                    break;
                case 36:
                    poop.isPlayerThought();
                    message = `"...everything is devoid of meaning..."`;
                    break;
                case 38:
                    poop.isPlayerThought();
                    message = `"...existence is a flake..."`;
                    break;
                case 40:
                    poop.isPlayerThought();
                    message = `"...society is an illusion..."`;
                    break;
                case 42:
                    poop.isPlayerThought();
                    message = `"...meaning is an empty construct..."`;
                    break;
                case 45:
                    poop.isPlayerThought();
                    message = `"......"`;
                    break;
                default:
                    if (45 > poop.cleaned) {
                        poop.notPlayerThought();
                        message = `You've cleaned ${poop.cleaned} poops`;
                    } else {
                        poop.isPlayerThought();
                        message = `"...i've cleaned ${poop.cleaned} poops..."`;
                    }
            }

            poop.scoreDisplay.innerHTML = message;
        }
    }
}
function getRandomNumber() {
    return Math.floor(Math.random() * (24000 - 4000 + 1)) + 4000;
}

function poopy() {
    setTimeout(() => {
        poop.show();
        poopy();
    }, getRandomNumber());
}

poopy();





