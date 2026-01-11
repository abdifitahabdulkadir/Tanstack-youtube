import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SignUpSchema, SignUpType } from '@/lib/validation'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: standardSchemaResolver(SignUpSchema),
  })

  async function handleFormSubmit(data: SignUpType) {
    console.log(data)
  }

  return (
    <Card className="w-full max-w-lg ">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                {...register('name')}
                placeholder="John Doe"
                className={cn(
                  'border border-black/10 outline-0 focus-visible:ring-0 focus-visible:outline-0 ring-0',
                  errors.name &&
                    'focus-visible:border-red-600 focus-visible:border-2',
                )}
              />
              <FieldError
                errors={
                  errors.name ? [{ message: errors.name.message }] : undefined
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="username@gmail.com"
                {...register('email')}
                className={cn(
                  'border border-black/10 outline-0 focus-visible:ring-0 focus-visible:outline-0 ring-0',
                  errors.email &&
                    'focus-visible:border-red-600 focus-visible:border-2',
                )}
              />
              <FieldError
                errors={
                  errors.email ? [{ message: errors.email.message }] : undefined
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                placeholder="Enter the password"
                type="password"
                {...register('password')}
                className={cn(
                  'border border-black/10 outline-0 focus-visible:ring-0 focus-visible:outline-0 ring-0',
                  errors.password &&
                    'focus-visible:border-red-600 focus-visible:border-2',
                )}
              />

              <FieldError
                errors={
                  errors.password
                    ? [{ message: errors.password.message }]
                    : undefined
                }
              />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?
                  <Link to="/login">Login In</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
