<script>
  import "$lib/styles.scss";

  import DOMPurify from 'dompurify';
  import { marked } from 'marked'

  import placeholders from "../../lib/followupex.js" 
  
  let state = "form"
  let email,
      output;

  let expert,
      topic,
      interest,
      date,
      email,
      phone;

  function randomize() {
    let example = placeholders[Math.floor(Math.random() * placeholders.length)]

    expert = example.expert
    topic = example.topic
    interest = example.interest
    date = example.date
    email = example.email
    phone = example.phone
  }

  async function generateEmail(e) {
    e.preventDefault() // Stops the default form behavior

    state = "loading"

    const response = await fetch(`./api/followup/?expert=${expert}&topic=${topic}&interest=${interest}&date=${date}&email=${email}&phone=${phone}`)
    output = await response.json()
    email = DOMPurify.sanitize(marked(output))

    state = "result"
  }

  function restart() {
    // Reset form fields
    expert = ""
    topic = ""
    interest = ""
    date = ""
    email = ""
    phone = ""

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
  <title>Followup</title>
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
        <label for="interest">Reason for Interest in Project</label>
        <input bind:value={interest} type="text" id="interest"/>
      </div>
      <div>
        <label for="date">Initial Outreach Date</label>
        <textarea bind:value={date} id="date"/>
      </div>
      <div>
        <label for="email">Email Address</label>
        <textarea bind:value={email} id="email"/>
      </div>
      <div>
        <label for="phone">Phone Number</label>
        <textarea bind:value={phone} id="phone"/>
      </div>

      <div class="horizontal-stack">
        <input type="submit" value="Get Followup Email" on:click={generateEmail} disabled={!(expert && topic && interest && date && email && phone)}/>
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