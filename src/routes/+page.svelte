<script>
  import "$lib/styles.scss";

  import DOMPurify from 'dompurify';
  import { marked } from 'marked'

  import placeholders from "../lib/examples.js" 
  
  let state = "form"
  let email,
      output;

  let expert = "",
      topic = "",
      challenge = "",
      hmw_1 = "",
      hmw_2 = "",
      hmw_3 = "";

  function randomize() {
    let example = placeholders[Math.floor(Math.random() * placeholders.length)]

    expert = example.expert
    topic = example.topic
    challenge = example.challenge
    hmw_1 = example.hmw_1
    hmw_2 = example.hmw_2
    hmw_3 = example.hmw_3
  }

  async function generateEmail(e) {
    e.preventDefault() // Stops the default form behavior

    state = "loading"

    const response = await fetch(`./api/default/?expert=${expert}&topic=${topic}&challenge=${challenge}&hmw_1=${hmw_1}&hmw_2=${hmw_2}&hmw_3=${hmw_3}`)
    output = await response.json()
    email = DOMPurify.sanitize(marked(output))

    state = "result"
  }

  function restart() {
    // Reset form fields
    expert = ""
    topic = ""
    challenge = ""
    hmw_1 = ""
    hmw_2 = ""
    hmw_3 = ""

    // Go back to form state
    state = "form"
  }

  let result_element;
  function copy() {
    navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([result_element.innerHTML], {type: 'text/html'})
      })
    ])
  }
</script>

<svelte:head>
  <title>Default</title>
</svelte:head>

<main>
  {#if state == "form"}
    <form>
      <div class="horizontal-stack">
        <div>
          <label for="expert">Expert</label>
          <input bind:value={expert} type="text" id="expert"/>
        </div>
        <div>
          <label for="topic">Project Topic</label>
          <input bind:value={topic} type="text" id="topic"/>
        </div>
      </div>
      <div>
        <label for="challenge">Challenge</label>
        <input bind:value={challenge} type="text" id="challenge"/>
      </div>
      <div>
        <label for="hmw1">How Might We Question #1</label>
        <textarea bind:value={hmw_1} id="hmw1"/>
      </div>
      <div>
        <label for="hmw2">How Might We Question #2</label>
        <textarea bind:value={hmw_2} id="hmw2"/>
      </div>
      <div>
        <label for="hmw3">How Might We Question #3</label>
        <textarea bind:value={hmw_3} id="hmw3"/>
      </div>

      <div class="horizontal-stack">
        <input type="submit" value="Get Outreach Email" on:click={generateEmail} disabled={!(expert && topic && challenge && hmw_1 && hmw_2 && hmw_3)}/>
        <button on:click={randomize}>Randomize</button>
      </div>
    </form>
  {:else if state == "loading"}
    <p>Loading...</p>
  {:else if state == "result"}
    <div bind:this={result_element} class="result">
      {@html email}
    </div>
    <button on:click={restart} class="back-arrow">
      <img alt="back arrow" src="back.svg"/>
    </button>
    <button on:click={copy} class="copy-icon">
      <img alt="copy text" src="copy.svg"/>
    </button>
  {/if}
</main>