import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import UseCaseFactory from 'application/UseCaseFactory'

export async function action(formData: FormData) {
  'use server'
  const name = formData.get('name')
  const email = formData.get('email')
  const cpf = formData.get('cpf')
  const type = formData.get('type')
  const plate = formData.get('plate')
  const signup = UseCaseFactory.getUseCase('Signup')
  const result = await signup.execute({
    name,
    email,
    cpf,
    type,
    carPlate: plate
  })

  if (result.isSuccess) redirect('/')
  revalidatePath('/signup')
}
