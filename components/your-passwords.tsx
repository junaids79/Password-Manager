import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"


interface Password{
  website:string,
  username: string,
  password:string
}
export default function YourPasswords({passwords}:{passwords:Password[]}) {


  return (
    <div className="space-y-4 h-28 overflow-y-scroll">
        {passwords.length=== 0 && "No passwords add"}
      {passwords.map((password,index) => (
        <Card key={index}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <Link href={password.website} target="_blank">
              <p className="font-semibold cursor-pointer text-blue-600 underline">{password.website}</p></Link>
              <p className="text-sm text-muted-foreground">{password.username}</p>
              <p className="text-sm text-muted-foreground">{password.password}</p>

            </div>
          
          </CardContent>
        </Card> 
      ))}
    </div>
  )
}

