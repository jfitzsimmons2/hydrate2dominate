import { ref } from 'vue';

const useAddToHomeScreen = () => {
    const deferredPrompt = ref();
    const captureEvent = () => {
        window.addEventListener("beforeinstallprompt", (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt.value = e;
            console.log(deferredPrompt.value);
        });
    };
    const clickCallback = () => {
        // Show the prompt
        deferredPrompt.value.prompt()
        // Wait for the user to respond to the prompt
        deferredPrompt.value.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                // Call another function?
            }
            deferredPrompt.value = null
        })
    }
    return { deferredPrompt, captureEvent, clickCallback }
}

export default useAddToHomeScreen;