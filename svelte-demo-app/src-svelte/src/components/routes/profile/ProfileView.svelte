<script type="ts">
  import { push } from 'svelte-spa-router'
  import { currentUserStream } from '../../../store/auth'
  import Routes from '../../../utils/routes'
  import { logOut } from '../../../utils/tfjs-utils'
  import { tfSessionStream, getContentSession } from '../../../store/sessions'

  async function logout() {
    logOut($tfSessionStream, await getContentSession())
    tfSessionStream.set(null)
    currentUserStream.set(null)
    push(Routes.Login)
  }

  $: pictureUrl = $currentUserStream?.pictureUrl
  $: firstName = $currentUserStream?.firstName
  $: lastName = $currentUserStream?.lastName
  $: email = $currentUserStream?.email
  $: sessionRoles = $currentUserStream?.sessionRoles
</script>

<article class="profile-view">
  <div class="page-header">
    <h1>Profile</h1>
  </div>

  <ion-item class="left-line" lines="none">
    <div class="avatar-sign-out-button" slot="start">
      <div class="border-pic">
        <ion-avatar class="profile-pic">
          <img src={pictureUrl ?? null} alt="" style="background-color: white;" />
        </ion-avatar>
      </div>
      <ion-button color="primary" expand="full" on:click={logout}>Log Out</ion-button>
    </div>
    <ion-list>
      <ion-item lines="none">
        <ion-label>
          <p class="label">First Name</p>
          <p class="value">{firstName ?? ''}&nbsp;</p>
        </ion-label>
      </ion-item>
      <ion-item lines="none">
        <ion-label>
          <p class="label">Last Name</p>
          <p class="value">{lastName ?? ''}&nbsp;</p>
        </ion-label>
      </ion-item>
      <ion-item lines="none">
        <ion-label>
          <p class="label">Email</p>
          <p class="value">{email ?? ''}&nbsp;</p>
        </ion-label>
      </ion-item>
      <ion-item lines="none">
        <ion-label>
          <p class="label">User Tye</p>
          <p class="value">
            {sessionRoles ? (sessionRoles.includes('tf-admin') ? 'superuser' : 'user') : ''}
            &nbsp;
          </p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-item>
</article>

<style type="text/scss">
  @import '../../../styles/variables.scss';
  @import '../../../styles/mixins.scss';

  .profile-view {
    padding-top: var(--topBarHeight);
    @include full-screen-paper-padding;
    @include paper-colors;
  }

  .avatar-sign-out-button {
    margin: 5px 50px 5px 5px;
  }

  .border-pic {
    width: 200px;
    height: 200px;
    // margin: 10px;
    border-radius: 100px;
    background-color: rgba(200, 200, 200, 1);
    display: flex;
  }

  .profile-pic {
    width: 180px;
    height: 180px;
    margin: 10px;
  }

  .left-line {
    border-left: 2px solid $primaryColor;
  }
  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
  }
  h1 {
    color: #707070;
    font-weight: 800;
    font-size: 2em;
    margin: 0;
    margin-right: 1em;
    flex: 1;
  }

  .value {
    font-size: 17px;
    color: #707070;
  }
</style>
