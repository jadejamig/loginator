'use client'

import { CardWrapper } from './CardWrapper';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { ResetSchema } from '@/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ErrorForm } from '../FormError';
import { SuccessForm } from '../FormSuccess';
import { reset } from '@/actions/reset';

const ResetForm = () => {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ""
    }
  });

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      reset(values)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        })
    })
  }

  return (
    <CardWrapper
        headerLabel='Forgot your password?'
        backButtonLabel="Back to login"
        backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} placeholder='john.doe@example.com' type='email'/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>
          <SuccessForm message={success}/>
          <ErrorForm message={error}/>
          <Button disabled={isPending} type='submit' className='w-full'>Reset password</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default ResetForm