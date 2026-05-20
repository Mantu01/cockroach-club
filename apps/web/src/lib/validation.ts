import {z} from 'zod';

const loginSchema=z.object({
  email:z.string().email({ message: "Please enter a valid email address" }),
  password:z.string().min(8,{ message: "Password must be at least 8 characters long" })
});

const signupSchema=z.object({
  email:z.string().email(),
  username:z.string().min(6, { message: "Username must be at least 6 characters long" }),
  password:z.string().min(8,{ message: "Password must be at least 8 characters long" }),
  confirmPassword:z.string()
})
.refine((data)=>data.password===data.confirmPassword,{
  message:'Password do not match',
  path:['confirmPassword']
});


export type LoginSchemaType=z.infer<typeof loginSchema>;
export type SignupSchemaType=z.infer<typeof signupSchema>;


export {
  loginSchema,
  signupSchema
}