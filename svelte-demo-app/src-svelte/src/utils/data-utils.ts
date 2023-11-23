import { getContentSession } from '../store/sessions'

export async function commit() {
    const contentSession = await getContentSession()
    if (contentSession && contentSession.getTransaction().hasManipulations()) {
        contentSession.commit();
        console.log('AUTOSAVE FINISHED!')
    }
}
