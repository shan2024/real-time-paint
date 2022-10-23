
// This component shows a thank you message for signing up correctly
export default function SignUpMessage() {
  return (<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div className="w-full max-w-md space-y-8">
    <div>
      <img className="mx-auto h-12 w-auto" src = "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt= "Website logo"></img>
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Thanks for signing up
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Head over to the 
        <a href="/login" className = "font-medium text-indigo-600 hover:text-indigo-500"> login page </a> 
        to sign into your account.
      </p>
    </div>
  </div>
</div>)
}
