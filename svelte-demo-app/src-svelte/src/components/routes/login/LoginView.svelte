<script type="ts">
  import { push } from 'svelte-spa-router'
  // import OauthBtn from "../../primitives/OauthBtn.svelte";
  // import Separator from "../../primitives/Separator.svelte";
  import * as tfjsUtils from '../../../utils/tfjs-utils'
  import { tfSessionStream } from '../../../store/sessions'

  let email
  let password = ''
  const langs = ['en', 'de']
  let showpass = false
  let error = ''

  function handleClick() {
    tfjsUtils
      .tfAuthenticate(email, password)
      .then((res) => {
        tfSessionStream.set(res)
        push('/profile')
      })
      .catch((err) => {
        console.log(err.DetailMessage)
        error = err.DetailMessage
      })
  }

  const showPass = (e) => {
    showpass = !showpass
  }
</script>

<article>
  <figure><img alt="TF" width="150" src="static/images/logo-tf-orange.svg" /></figure>

  <figure>
    <ion-icon src="static/icons/profile-login.svg" />
  </figure>
  <div class="form sign-in">
    <div class="label">
      <div class="ico-item">
        <ion-icon name="mail-outline" />
        <input bind:value={email} type="email" placeholder="email" />
      </div>
    </div>

    <div class="label">
      <div class="ico-item">
        <ion-icon
          name={showpass ? 'lock-open-outline' : 'lock-closed-outline'}
          on:click={showPass} />
        {#if showpass}
          <input
            bind:value={password}
            type="text"
            autocomplete="new-password"
            placeholder="password" />
        {:else}
          <input
            bind:value={password}
            type="password"
            autocomplete="new-password"
            placeholder="password" />
        {/if}
        <!-- <ion-icon name="eye" on:click={showPass} /> -->
      </div>
    </div>

    {#if error}
      <div class="error">{error}</div>
    {/if}
    <button type="button" class="submit" on:click={handleClick}>Login</button>
  </div>
</article>

<style type="text/scss">
  @import '../../../styles/variables.scss';

  article {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--bodyBgColor);
    padding-top: 5%;
  }

  .label {
    display: block;
    width: 350px;
    margin: 10px auto 0;
    text-align: center;
    color: gray;
    background: transparent;
  }

  .ico-item {
    display: flex;
    background-color: #b4b4b4;
    border-radius: 3px;
    padding-left: 5px;
    align-items: center;
    ion-icon {
      font-size: 24px;
      color: white;
    }
  }

  input {
    display: block;
    width: 100%;
    font-size: 16px;
    color: white;
    background-color: #b4b4b4;
    border: none;
    outline: none;
  }

  ::placeholder {
    color: white;
    opacity: 0.4;
  }

  .submit {
    display: block;
    margin: 55px auto;
    min-width: 150px;
    height: 50px;
    border-radius: 25px;
    font-size: 18px;
    background-color: var(--primaryColor);
    color: white;
    background-image: linear-gradient(
      to bottom right,
      var(--primaryColor),
      var(--primaryColorShade)
    );
  }

  .submit:hover {
    cursor: pointer;
    border: 1px solid #d3dae9;
  }

  figure {
    text-align: center;
    margin: 0 auto;
    color: rgb(255, 255, 255);
  }

  figure {
    margin: 2em 0 1em 0;
    ion-icon {
      font-size: 150px;
      color: #b4b4b4;
    }
  }

  img {
    margin: 0 0 1em 0;
  }

  .error {
    color: var(--primaryColor);
    padding-top: 15px;
    position: absolute;
  }
</style>
