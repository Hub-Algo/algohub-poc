/* eslint-disable */
/**
 * This file was automatically generated by @algorandfoundation/algokit-client-generator.
 * DO NOT MODIFY IT BY HAND.
 * requires: @algorandfoundation/algokit-utils: ^2
 */
import * as algokit from '@algorandfoundation/algokit-utils'
import type {
  AppCallTransactionResult,
  AppCallTransactionResultOfType,
  CoreAppCallArgs,
  RawAppCallArgs,
  AppState,
  TealTemplateParams,
  ABIAppCallArg,
} from '@algorandfoundation/algokit-utils/types/app'
import type {
  AppClientCallCoreParams,
  AppClientCompilationParams,
  AppClientDeployCoreParams,
  AppDetails,
  ApplicationClient,
} from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type { SendTransactionResult, TransactionToSign, SendTransactionFrom } from '@algorandfoundation/algokit-utils/types/transaction'
import type { TransactionWithSigner } from 'algosdk'
import { Algodv2, OnApplicationComplete, Transaction, AtomicTransactionComposer } from 'algosdk'
export const APP_SPEC: AppSpec = {
  "hints": {
    "createApplication()void": {
      "call_config": {
        "no_op": "CREATE"
      }
    },
    "createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "getAllCampaignApps()uint64[]": {
      "call_config": {
        "no_op": "CALL"
      }
    }
  },
  "bare_call_config": {
    "no_op": "NEVER",
    "opt_in": "CREATE",
    "close_out": "NEVER",
    "update_application": "NEVER",
    "delete_application": "NEVER"
  },
  "schema": {
    "local": {
      "declared": {},
      "reserved": {}
    },
    "global": {
      "declared": {
        "algohubCampaigns": {
          "type": "bytes",
          "key": "algohubCampaigns"
        }
      },
      "reserved": {}
    }
  },
  "state": {
    "global": {
      "num_byte_slices": 1,
      "num_uints": 0
    },
    "local": {
      "num_byte_slices": 0,
      "num_uints": 0
    }
  },
  "source": {
    "approval": "I3ByYWdtYSB2ZXJzaW9uIDkKCi8vIFRoaXMgVEVBTCB3YXMgZ2VuZXJhdGVkIGJ5IFRFQUxTY3JpcHQgdjAuNjEuMAovLyBodHRwczovL2dpdGh1Yi5jb20vYWxnb3JhbmRmb3VuZGF0aW9uL1RFQUxTY3JpcHQKCi8vIFRoaXMgY29udHJhY3QgaXMgY29tcGxpYW50IHdpdGggYW5kL29yIGltcGxlbWVudHMgdGhlIGZvbGxvd2luZyBBUkNzOiBbIEFSQzQgXQoKLy8gVGhlIGZvbGxvd2luZyB0ZW4gbGluZXMgb2YgVEVBTCBoYW5kbGUgaW5pdGlhbCBwcm9ncmFtIGZsb3cKLy8gVGhpcyBwYXR0ZXJuIGlzIHVzZWQgdG8gbWFrZSBpdCBlYXN5IGZvciBhbnlvbmUgdG8gcGFyc2UgdGhlIHN0YXJ0IG9mIHRoZSBwcm9ncmFtIGFuZCBkZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBhY3Rpb24gaXMgYWxsb3dlZAovLyBIZXJlLCBhY3Rpb24gcmVmZXJzIHRvIHRoZSBPbkNvbXBsZXRlIGluIGNvbWJpbmF0aW9uIHdpdGggd2hldGhlciB0aGUgYXBwIGlzIGJlaW5nIGNyZWF0ZWQgb3IgY2FsbGVkCi8vIEV2ZXJ5IHBvc3NpYmxlIGFjdGlvbiBmb3IgdGhpcyBjb250cmFjdCBpcyByZXByZXNlbnRlZCBpbiB0aGUgc3dpdGNoIHN0YXRlbWVudAovLyBJZiB0aGUgYWN0aW9uIGlzIG5vdCBpbXBsbWVudGVkIGluIHRoZSBjb250cmFjdCwgaXRzIHJlcHNlY3RpdmUgYnJhbmNoIHdpbGwgYmUgIk5PVF9JTVBMTUVOVEVEIiB3aGljaCBqdXN0IGNvbnRhaW5zICJlcnIiCnR4biBBcHBsaWNhdGlvbklECmludCAwCj4KaW50IDYKKgp0eG4gT25Db21wbGV0aW9uCisKc3dpdGNoIGNyZWF0ZV9Ob09wIGNyZWF0ZV9PcHRJbiBOT1RfSU1QTEVNRU5URUQgTk9UX0lNUExFTUVOVEVEIE5PVF9JTVBMRU1FTlRFRCBOT1RfSU1QTEVNRU5URUQgY2FsbF9Ob09wIGNhbGxfT3B0SW4KCk5PVF9JTVBMRU1FTlRFRDoKCWVycgoKLy8gY3JlYXRlQXBwbGljYXRpb24oKXZvaWQKYWJpX3JvdXRlX2NyZWF0ZUFwcGxpY2F0aW9uOgoJLy8gZXhlY3V0ZSBjcmVhdGVBcHBsaWNhdGlvbigpdm9pZAoJY2FsbHN1YiBjcmVhdGVBcHBsaWNhdGlvbgoJaW50IDEKCXJldHVybgoKY3JlYXRlQXBwbGljYXRpb246Cglwcm90byAwIDAKCXJldHN1YgoKLy8gY3JlYXRlQ2FtcGFpZ24oc3RyaW5nLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0KXVpbnQ2NAphYmlfcm91dGVfY3JlYXRlQ2FtcGFpZ246CglieXRlIDB4OyBkdXAgLy8gcHVzaCBlbXB0eSBieXRlcyB0byBmaWxsIHRoZSBzdGFjayBmcmFtZSBmb3IgdGhpcyBzdWJyb3V0aW5lJ3MgbG9jYWwgdmFyaWFibGVzCgoJLy8gbWV0YWRhdGFVcmw6IHN0cmluZwoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwoJZXh0cmFjdCAyIDAKCgkvLyBlbmRUaW1lOiB1aW50NjQKCXR4bmEgQXBwbGljYXRpb25BcmdzIDYKCWJ0b2kKCgkvLyBzdGFydFRpbWU6IHVpbnQ2NAoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQoJYnRvaQoKCS8vIGhhcmRDYXA6IHVpbnQ2NAoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAoJYnRvaQoKCS8vIHNvZnRDYXA6IHVpbnQ2NAoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwoJYnRvaQoKCS8vIG1heEJ1eUNhcDogdWludDY0Cgl0eG5hIEFwcGxpY2F0aW9uQXJncyAyCglidG9pCgoJLy8gcHJpY2U6IHVpbnQ2NAoJdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQoJYnRvaQoKCS8vIGV4ZWN1dGUgY3JlYXRlQ2FtcGFpZ24oc3RyaW5nLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0KXVpbnQ2NAoJY2FsbHN1YiBjcmVhdGVDYW1wYWlnbgoJaW50IDEKCXJldHVybgoKY3JlYXRlQ2FtcGFpZ246Cglwcm90byA5IDAKCgkvLyBjb250cmFjdHMvY2FtcGFpZ24vY2FtcGFpZ24uYWxnby50czoxNzEKCS8vIHNlbmRNZXRob2RDYWxsPFtdLCB2b2lkPih7CgkvLyAgICAgICBuYW1lOiAnY3JlYXRlQXBwbGljYXRpb24nLAoJLy8gICAgICAgY2xlYXJTdGF0ZVByb2dyYW06IENhbXBhaWduLmNsZWFyUHJvZ3JhbSgpLAoJLy8gICAgICAgYXBwcm92YWxQcm9ncmFtOiBDYW1wYWlnbi5hcHByb3ZhbFByb2dyYW0oKSwKCS8vICAgICAgIGdsb2JhbE51bUJ5dGVTbGljZTogNSwKCS8vICAgICAgIGdsb2JhbE51bVVpbnQ6IDIsCgkvLyAgICAgfSkKCWl0eG5fYmVnaW4KCWludCBhcHBsCglpdHhuX2ZpZWxkIFR5cGVFbnVtCgltZXRob2QgImNyZWF0ZUFwcGxpY2F0aW9uKCl2b2lkIgoJaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKCgkvLyBjb250cmFjdHMvY2FtcGFpZ24vY2FtcGFpZ24uYWxnby50czoxNzMKCS8vIGNsZWFyU3RhdGVQcm9ncmFtOiBDYW1wYWlnbi5jbGVhclByb2dyYW0oKQoJYnl0ZSBiNjQgQ1E9PQoJaXR4bl9maWVsZCBDbGVhclN0YXRlUHJvZ3JhbQoKCS8vIGNvbnRyYWN0cy9jYW1wYWlnbi9jYW1wYWlnbi5hbGdvLnRzOjE3NAoJLy8gYXBwcm92YWxQcm9ncmFtOiBDYW1wYWlnbi5hcHByb3ZhbFByb2dyYW0oKQoJYnl0ZSBiNjQgQ1NBQ0FRQW1CUWhqWVcxd1lXbG5iZ0FLZG05MFpYTlViM1JoYkF4MmIzUmxjMGx1Um1GMmIzSUVGUjk4ZFRFWUl3MkJCZ3N4R1FpTkJ3RVlBQUFBQUFBQUFBQUFBQUVyQUlnQUFpSkRpZ0FBaVRZYUIxY0NBRFlhQmhjMkdnVVhOaG9FRnpZYUF4YzJHZ0lYTmhvQkY0Z0FBaUpEaWdjQUtDa3BnQUlBTW92L0ZvZ0JQSXYrRm9nQk5vdjlGb2dCTUl2OEZvZ0JLb3Y3Rm9nQkpJdjZGb2dCSG92NVNSVVdWd1lDVEZDSUFSNUlVR2VKaUFBQ0lrT0tBQUNKaUFBQ0lrT0tBQUNKaUFBQ0lrT0tBQUNKaUFBQ0lrT0tBQUNKaUFBQ0lrT0tBQUNKTmhvQ0Y4QXdOaG9CU1JVaUVrUWpVNGdBQWlKRGlnSUFNUUNBQzNadmRHVnljMEZ6WVVsa1pIQUFSQ0lOUkNvcVpDSUlaNHYvUVFBR0t5dGtJZ2huaVlnQUFpSkRpZ0FBS0dRbkJFeFFzSW1JQUFJaVE0b0FBSUFQZG1WemRHbHVaMU5qYUdWa2RXeGxaQ2NFVEZDd2lZb0FBU0tKaWdBQklvbUtBQUVpaVRFYlFmN2tnQVM0UkhzMk5ob0FqZ0grMXdDQUJGZ2pBbHFBQkVnRE9naUFCUEZYZHlhQUJLRU5XUStBQkMyTENQR0FCT0VmWTlHQUJFQ1l3L2FBQkJEVkRNQ0FCRVk2dU5FMkdnQ09DZjZTL3ZUKy9mOEcvdy8vR1A4aC8ySC9jUUNLQkFPTC9Jdi9VSXY5aS82SmlnUURpL3lML2xDTS9Jdi9TUldML2hjSUZsY0dBb3oraS8xTVVJejlpL3lML1l2K2lRPT0KCWl0eG5fZmllbGQgQXBwcm92YWxQcm9ncmFtCgoJLy8gY29udHJhY3RzL2NhbXBhaWduL2NhbXBhaWduLmFsZ28udHM6MTc1CgkvLyBnbG9iYWxOdW1CeXRlU2xpY2U6IDUKCWludCA1CglpdHhuX2ZpZWxkIEdsb2JhbE51bUJ5dGVTbGljZQoKCS8vIGNvbnRyYWN0cy9jYW1wYWlnbi9jYW1wYWlnbi5hbGdvLnRzOjE3NgoJLy8gZ2xvYmFsTnVtVWludDogMgoJaW50IDIKCWl0eG5fZmllbGQgR2xvYmFsTnVtVWludAoKCS8vIEZlZSBmaWVsZCBub3Qgc2V0LCBkZWZhdWx0aW5nIHRvIDAKCWludCAwCglpdHhuX2ZpZWxkIEZlZQoKCS8vIFN1Ym1pdCBpbm5lciB0cmFuc2FjdGlvbgoJaXR4bl9zdWJtaXQKCgkvLyBjb250cmFjdHMvY2FtcGFpZ24vY2FtcGFpZ24uYWxnby50czoxNzkKCS8vIGZhY3RvcnlBcHAgPSB0aGlzLml0eG4uY3JlYXRlZEFwcGxpY2F0aW9uSUQKCWl0eG4gQ3JlYXRlZEFwcGxpY2F0aW9uSUQKCWZyYW1lX2J1cnkgLTggLy8gZmFjdG9yeUFwcDogYXBwbGljYXRpb24KCgkvLyBjb250cmFjdHMvY2FtcGFpZ24vY2FtcGFpZ24uYWxnby50czoxODEKCS8vIHNlbmRQYXltZW50KHsKCS8vICAgICAgIGFtb3VudDogMjAwXzAwMCwKCS8vICAgICAgIHJlY2VpdmVyOiBmYWN0b3J5QXBwLmFkZHJlc3MsCgkvLyAgICAgfSkKCWl0eG5fYmVnaW4KCWludCBwYXkKCWl0eG5fZmllbGQgVHlwZUVudW0KCgkvLyBjb250cmFjdHMvY2FtcGFpZ24vY2FtcGFpZ24uYWxnby50czoxODIKCS8vIGFtb3VudDogMjAwXzAwMAoJaW50IDIwMF8wMDAKCWl0eG5fZmllbGQgQW1vdW50CgoJLy8gY29udHJhY3RzL2NhbXBhaWduL2NhbXBhaWduLmFsZ28udHM6MTgzCgkvLyByZWNlaXZlcjogZmFjdG9yeUFwcC5hZGRyZXNzCglmcmFtZV9kaWcgLTggLy8gZmFjdG9yeUFwcDogYXBwbGljYXRpb24KCWFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKCWFzc2VydAoJaXR4bl9maWVsZCBSZWNlaXZlcgoKCS8vIEZlZSBmaWVsZCBub3Qgc2V0LCBkZWZhdWx0aW5nIHRvIDAKCWludCAwCglpdHhuX2ZpZWxkIEZlZQoKCS8vIFN1Ym1pdCBpbm5lciB0cmFuc2FjdGlvbgoJaXR4bl9zdWJtaXQKCgkvLyBpZjBfY29uZGl0aW9uCgkvLyBjb250cmFjdHMvY2FtcGFpZ24vY2FtcGFpZ24uYWxnby50czoxODUKCS8vIHRoaXMuYWxnb2h1YkNhbXBhaWducy5leGlzdHMKCXR4bmEgQXBwbGljYXRpb25zIDAKCWJ5dGUgMHg2MTZjNjc2ZjY4NzU2MjQzNjE2ZDcwNjE2OTY3NmU3MyAvLyAiYWxnb2h1YkNhbXBhaWducyIKCWFwcF9nbG9iYWxfZ2V0X2V4Cglzd2FwCglwb3AKCWJ6IGlmMF9lbHNlCgoJLy8gaWYwX2NvbnNlcXVlbnQKCS8vIGNvbnRyYWN0cy9jYW1wYWlnbi9jYW1wYWlnbi5hbGdvLnRzOjE4NgoJLy8gdGhpcy5hbGdvaHViQ2FtcGFpZ25zLnZhbHVlLnB1c2goZmFjdG9yeUFwcCkKCWJ5dGUgMHg2MTZjNjc2ZjY4NzU2MjQzNjE2ZDcwNjE2OTY3NmU3MyAvLyAiYWxnb2h1YkNhbXBhaWducyIKCWFwcF9nbG9iYWxfZ2V0CglleHRyYWN0IDIgMAoJZnJhbWVfZGlnIC04IC8vIGZhY3RvcnlBcHA6IGFwcGxpY2F0aW9uCglpdG9iCgljb25jYXQKCWJ5dGUgMHg2MTZjNjc2ZjY4NzU2MjQzNjE2ZDcwNjE2OTY3NmU3MyAvLyAiYWxnb2h1YkNhbXBhaWducyIKCXN3YXAKCWR1cAoJbGVuCglpbnQgOAoJLwoJaXRvYgoJZXh0cmFjdCA2IDIKCXN3YXAKCWNvbmNhdAoJYXBwX2dsb2JhbF9wdXQKCWIgaWYwX2VuZAoKaWYwX2Vsc2U6CgkvLyBjb250cmFjdHMvY2FtcGFpZ24vY2FtcGFpZ24uYWxnby50czoxODgKCS8vIG5ld0FwcDogQXBwbGljYXRpb25bXSA9IFtmYWN0b3J5QXBwXQoJZnJhbWVfZGlnIC04IC8vIGZhY3RvcnlBcHA6IGFwcGxpY2F0aW9uCglpdG9iCglmcmFtZV9idXJ5IC05IC8vIG5ld0FwcDogYXBwbGljYXRpb25bXQoKCS8vIGNvbnRyYWN0cy9jYW1wYWlnbi9jYW1wYWlnbi5hbGdvLnRzOjE4OQoJLy8gdGhpcy5hbGdvaHViQ2FtcGFpZ25zLnZhbHVlID0gbmV3QXBwCglieXRlIDB4NjE2YzY3NmY2ODc1NjI0MzYxNmQ3MDYxNjk2NzZlNzMgLy8gImFsZ29odWJDYW1wYWlnbnMiCglmcmFtZV9kaWcgLTkgLy8gbmV3QXBwOiBhcHBsaWNhdGlvbltdCglkdXAKCWxlbgoJaW50IDgKCS8KCWl0b2IKCWV4dHJhY3QgNiAyCglzd2FwCgljb25jYXQKCWFwcF9nbG9iYWxfcHV0CgppZjBfZW5kOgoJLy8gY29udHJhY3RzL2NhbXBhaWduL2NhbXBhaWduLmFsZ28udHM6MTkyCgkvLyBzZW5kTWV0aG9kQ2FsbDxbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgc3RyaW5nXSwgdm9pZD4oewoJLy8gICAgICAgYXBwbGljYXRpb25JRDogZmFjdG9yeUFwcCwKCS8vICAgICAgIG5hbWU6ICdjcmVhdGVDYW1wYWlnbicsCgkvLyAgICAgICBtZXRob2RBcmdzOiBbcHJpY2UsIG1heEJ1eUNhcCwgc29mdENhcCwgaGFyZENhcCwgc3RhcnRUaW1lLCBlbmRUaW1lLCBtZXRhZGF0YVVybF0sCgkvLyAgICAgfSkKCWl0eG5fYmVnaW4KCWludCBhcHBsCglpdHhuX2ZpZWxkIFR5cGVFbnVtCgltZXRob2QgImNyZWF0ZUNhbXBhaWduKHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHN0cmluZyl2b2lkIgoJaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKCgkvLyBjb250cmFjdHMvY2FtcGFpZ24vY2FtcGFpZ24uYWxnby50czoxOTMKCS8vIGFwcGxpY2F0aW9uSUQ6IGZhY3RvcnlBcHAKCWZyYW1lX2RpZyAtOCAvLyBmYWN0b3J5QXBwOiBhcHBsaWNhdGlvbgoJaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECgoJLy8gY29udHJhY3RzL2NhbXBhaWduL2NhbXBhaWduLmFsZ28udHM6MTk1CgkvLyBtZXRob2RBcmdzOiBbcHJpY2UsIG1heEJ1eUNhcCwgc29mdENhcCwgaGFyZENhcCwgc3RhcnRUaW1lLCBlbmRUaW1lLCBtZXRhZGF0YVVybF0KCWZyYW1lX2RpZyAtMSAvLyBwcmljZTogdWludDY0CglpdG9iCglpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwoJZnJhbWVfZGlnIC0yIC8vIG1heEJ1eUNhcDogdWludDY0CglpdG9iCglpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwoJZnJhbWVfZGlnIC0zIC8vIHNvZnRDYXA6IHVpbnQ2NAoJaXRvYgoJaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKCWZyYW1lX2RpZyAtNCAvLyBoYXJkQ2FwOiB1aW50NjQKCWl0b2IKCWl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCglmcmFtZV9kaWcgLTUgLy8gc3RhcnRUaW1lOiB1aW50NjQKCWl0b2IKCWl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCglmcmFtZV9kaWcgLTYgLy8gZW5kVGltZTogdWludDY0CglpdG9iCglpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwoJZnJhbWVfZGlnIC03IC8vIG1ldGFkYXRhVXJsOiBieXRlcwoJZHVwCglsZW4KCWl0b2IKCWV4dHJhY3QgNiAyCglzd2FwCgljb25jYXQKCWl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCgoJLy8gRmVlIGZpZWxkIG5vdCBzZXQsIGRlZmF1bHRpbmcgdG8gMAoJaW50IDAKCWl0eG5fZmllbGQgRmVlCgoJLy8gU3VibWl0IGlubmVyIHRyYW5zYWN0aW9uCglpdHhuX3N1Ym1pdAoKCS8vIGNvbnRyYWN0cy9jYW1wYWlnbi9jYW1wYWlnbi5hbGdvLnRzOjE5OAoJLy8gcmV0dXJuIGZhY3RvcnlBcHA7CglmcmFtZV9kaWcgLTggLy8gZmFjdG9yeUFwcDogYXBwbGljYXRpb24KCWl0b2IKCWJ5dGUgMHgxNTFmN2M3NQoJc3dhcAoJY29uY2F0Cglsb2cKCXJldHN1YgoKLy8gZ2V0QWxsQ2FtcGFpZ25BcHBzKClhcHBsaWNhdGlvbltdCmFiaV9yb3V0ZV9nZXRBbGxDYW1wYWlnbkFwcHM6CgkvLyBleGVjdXRlIGdldEFsbENhbXBhaWduQXBwcygpYXBwbGljYXRpb25bXQoJY2FsbHN1YiBnZXRBbGxDYW1wYWlnbkFwcHMKCWludCAxCglyZXR1cm4KCmdldEFsbENhbXBhaWduQXBwczoKCXByb3RvIDAgMAoKCS8vIGNvbnRyYWN0cy9jYW1wYWlnbi9jYW1wYWlnbi5hbGdvLnRzOjIwMgoJLy8gcmV0dXJuIHRoaXMuYWxnb2h1YkNhbXBhaWducy52YWx1ZTsKCWJ5dGUgMHg2MTZjNjc2ZjY4NzU2MjQzNjE2ZDcwNjE2OTY3NmU3MyAvLyAiYWxnb2h1YkNhbXBhaWducyIKCWFwcF9nbG9iYWxfZ2V0CglleHRyYWN0IDIgMAoJZHVwCglsZW4KCWludCA4CgkvCglpdG9iCglleHRyYWN0IDYgMgoJc3dhcAoJY29uY2F0CglieXRlIDB4MTUxZjdjNzUKCXN3YXAKCWNvbmNhdAoJbG9nCglyZXRzdWIKCmNyZWF0ZV9Ob09wOgoJbWV0aG9kICJjcmVhdGVBcHBsaWNhdGlvbigpdm9pZCIKCXR4bmEgQXBwbGljYXRpb25BcmdzIDAKCW1hdGNoIGFiaV9yb3V0ZV9jcmVhdGVBcHBsaWNhdGlvbgoJZXJyCgpjYWxsX05vT3A6CgltZXRob2QgImNyZWF0ZUNhbXBhaWduKHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHN0cmluZyl1aW50NjQiCgltZXRob2QgImdldEFsbENhbXBhaWduQXBwcygpdWludDY0W10iCgl0eG5hIEFwcGxpY2F0aW9uQXJncyAwCgltYXRjaCBhYmlfcm91dGVfY3JlYXRlQ2FtcGFpZ24gYWJpX3JvdXRlX2dldEFsbENhbXBhaWduQXBwcwoJZXJyCgpjcmVhdGVfT3B0SW46Cgl0eG4gTnVtQXBwQXJncwoJYnogYWJpX3JvdXRlX2NyZWF0ZUFwcGxpY2F0aW9uCgllcnIKCmNhbGxfT3B0SW46CgllcnI=",
    "clear": "I3ByYWdtYSB2ZXJzaW9uIDk="
  },
  "contract": {
    "name": "AlgohubCampaignFactory",
    "desc": "",
    "methods": [
      {
        "name": "createApplication",
        "args": [],
        "desc": "",
        "returns": {
          "type": "void",
          "desc": ""
        }
      },
      {
        "name": "createCampaign",
        "args": [
          {
            "name": "price",
            "type": "uint64",
            "desc": ""
          },
          {
            "name": "maxBuyCap",
            "type": "uint64",
            "desc": ""
          },
          {
            "name": "softCap",
            "type": "uint64",
            "desc": ""
          },
          {
            "name": "hardCap",
            "type": "uint64",
            "desc": ""
          },
          {
            "name": "startTime",
            "type": "uint64",
            "desc": ""
          },
          {
            "name": "endTime",
            "type": "uint64",
            "desc": ""
          },
          {
            "name": "metadataUrl",
            "type": "string",
            "desc": ""
          }
        ],
        "desc": "",
        "returns": {
          "type": "uint64",
          "desc": ""
        }
      },
      {
        "name": "getAllCampaignApps",
        "args": [],
        "desc": "",
        "returns": {
          "type": "uint64[]",
          "desc": ""
        }
      }
    ]
  }
}

/**
 * Defines an onCompletionAction of 'no_op'
 */
export type OnCompleteNoOp =  { onCompleteAction?: 'no_op' | OnApplicationComplete.NoOpOC }
/**
 * Defines an onCompletionAction of 'opt_in'
 */
export type OnCompleteOptIn =  { onCompleteAction: 'opt_in' | OnApplicationComplete.OptInOC }
/**
 * Defines an onCompletionAction of 'close_out'
 */
export type OnCompleteCloseOut =  { onCompleteAction: 'close_out' | OnApplicationComplete.CloseOutOC }
/**
 * Defines an onCompletionAction of 'delete_application'
 */
export type OnCompleteDelApp =  { onCompleteAction: 'delete_application' | OnApplicationComplete.DeleteApplicationOC }
/**
 * Defines an onCompletionAction of 'update_application'
 */
export type OnCompleteUpdApp =  { onCompleteAction: 'update_application' | OnApplicationComplete.UpdateApplicationOC }
/**
 * A state record containing a single unsigned integer
 */
export type IntegerState = {
  /**
   * Gets the state value as a BigInt 
   */
  asBigInt(): bigint
  /**
   * Gets the state value as a number.
   */
  asNumber(): number
}
/**
 * A state record containing binary data
 */
export type BinaryState = {
  /**
   * Gets the state value as a Uint8Array
   */
  asByteArray(): Uint8Array
  /**
   * Gets the state value as a string
   */
  asString(): string
}

/**
 * Defines the types of available calls and state of the AlgohubCampaignFactory smart contract.
 */
export type AlgohubCampaignFactory = {
  /**
   * Maps method signatures / names to their argument and return types.
   */
  methods:
    & Record<'createApplication()void' | 'createApplication', {
      argsObj: {
      }
      argsTuple: []
      returns: void
    }>
    & Record<'createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64' | 'createCampaign', {
      argsObj: {
        price: bigint | number
        maxBuyCap: bigint | number
        softCap: bigint | number
        hardCap: bigint | number
        startTime: bigint | number
        endTime: bigint | number
        metadataUrl: string
      }
      argsTuple: [price: bigint | number, maxBuyCap: bigint | number, softCap: bigint | number, hardCap: bigint | number, startTime: bigint | number, endTime: bigint | number, metadataUrl: string]
      returns: bigint
    }>
    & Record<'getAllCampaignApps()uint64[]' | 'getAllCampaignApps', {
      argsObj: {
      }
      argsTuple: []
      returns: bigint[]
    }>
  /**
   * Defines the shape of the global and local state of the application.
   */
  state: {
    global: {
      'algohubCampaigns'?: BinaryState
    }
  }
}
/**
 * Defines the possible abi call signatures
 */
export type AlgohubCampaignFactorySig = keyof AlgohubCampaignFactory['methods']
/**
 * Defines an object containing all relevant parameters for a single call to the contract. Where TSignature is undefined, a bare call is made
 */
export type TypedCallParams<TSignature extends AlgohubCampaignFactorySig | undefined> = {
  method: TSignature
  methodArgs: TSignature extends undefined ? undefined : Array<ABIAppCallArg | undefined>
} & AppClientCallCoreParams & CoreAppCallArgs
/**
 * Defines the arguments required for a bare call
 */
export type BareCallArgs = Omit<RawAppCallArgs, keyof CoreAppCallArgs>
/**
 * Maps a method signature from the AlgohubCampaignFactory smart contract to the method's arguments in either tuple of struct form
 */
export type MethodArgs<TSignature extends AlgohubCampaignFactorySig> = AlgohubCampaignFactory['methods'][TSignature]['argsObj' | 'argsTuple']
/**
 * Maps a method signature from the AlgohubCampaignFactory smart contract to the method's return type
 */
export type MethodReturn<TSignature extends AlgohubCampaignFactorySig> = AlgohubCampaignFactory['methods'][TSignature]['returns']

/**
 * A factory for available 'create' calls
 */
export type AlgohubCampaignFactoryCreateCalls = (typeof AlgohubCampaignFactoryCallFactory)['create']
/**
 * Defines supported create methods for this smart contract
 */
export type AlgohubCampaignFactoryCreateCallParams =
  | (TypedCallParams<undefined> & (OnCompleteOptIn))
  | (TypedCallParams<'createApplication()void'> & (OnCompleteNoOp))
/**
 * Defines arguments required for the deploy method.
 */
export type AlgohubCampaignFactoryDeployArgs = {
  deployTimeParams?: TealTemplateParams
  /**
   * A delegate which takes a create call factory and returns the create call params for this smart contract
   */
  createCall?: (callFactory: AlgohubCampaignFactoryCreateCalls) => AlgohubCampaignFactoryCreateCallParams
}


/**
 * Exposes methods for constructing all available smart contract calls
 */
export abstract class AlgohubCampaignFactoryCallFactory {
  /**
   * Gets available create call factories
   */
  static get create() {
    return {
      /**
       * Constructs a create call for the AlgohubCampaignFactory smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs & AppClientCompilationParams & (OnCompleteOptIn)) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
      /**
       * Constructs a create call for the AlgohubCampaignFactory smart contract using the createApplication()void ABI method
       *
       * @param args Any args for the contract call
       * @param params Any additional parameters for the call
       * @returns A TypedCallParams object for the call
       */
      createApplication(args: MethodArgs<'createApplication()void'>, params: AppClientCallCoreParams & CoreAppCallArgs & AppClientCompilationParams & (OnCompleteNoOp) = {}) {
        return {
          method: 'createApplication()void' as const,
          methodArgs: Array.isArray(args) ? args : [],
          ...params,
        }
      },
    }
  }

  /**
   * Constructs a no op call for the createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64 ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static createCampaign(args: MethodArgs<'createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64' as const,
      methodArgs: Array.isArray(args) ? args : [args.price, args.maxBuyCap, args.softCap, args.hardCap, args.startTime, args.endTime, args.metadataUrl],
      ...params,
    }
  }
  /**
   * Constructs a no op call for the getAllCampaignApps()uint64[] ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static getAllCampaignApps(args: MethodArgs<'getAllCampaignApps()uint64[]'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'getAllCampaignApps()uint64[]' as const,
      methodArgs: Array.isArray(args) ? args : [],
      ...params,
    }
  }
}

/**
 * A client to make calls to the AlgohubCampaignFactory smart contract
 */
export class AlgohubCampaignFactoryClient {
  /**
   * The underlying `ApplicationClient` for when you want to have more flexibility
   */
  public readonly appClient: ApplicationClient

  private readonly sender: SendTransactionFrom | undefined

  /**
   * Creates a new instance of `AlgohubCampaignFactoryClient`
   *
   * @param appDetails appDetails The details to identify the app to deploy
   * @param algod An algod client instance
   */
  constructor(appDetails: AppDetails, private algod: Algodv2) {
    this.sender = appDetails.sender
    this.appClient = algokit.getAppClient({
      ...appDetails,
      app: APP_SPEC
    }, algod)
  }

  /**
   * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
   *
   * @param result The AppCallTransactionResult to be mapped
   * @param returnValueFormatter An optional delegate to format the return value if required
   * @returns The smart contract response with an updated return value
   */
  protected mapReturnValue<TReturn>(result: AppCallTransactionResult, returnValueFormatter?: (value: any) => TReturn): AppCallTransactionResultOfType<TReturn> {
    if(result.return?.decodeError) {
      throw result.return.decodeError
    }
    const returnValue = result.return?.returnValue !== undefined && returnValueFormatter !== undefined
      ? returnValueFormatter(result.return.returnValue)
      : result.return?.returnValue as TReturn | undefined
      return { ...result, return: returnValue }
  }

  /**
   * Calls the ABI method with the matching signature using an onCompletion code of NO_OP
   *
   * @param typedCallParams An object containing the method signature, args, and any other relevant parameters
   * @param returnValueFormatter An optional delegate which when provided will be used to map non-undefined return values to the target type
   * @returns The result of the smart contract call
   */
  public async call<TSignature extends keyof AlgohubCampaignFactory['methods']>(typedCallParams: TypedCallParams<TSignature>, returnValueFormatter?: (value: any) => MethodReturn<TSignature>) {
    return this.mapReturnValue<MethodReturn<TSignature>>(await this.appClient.call(typedCallParams), returnValueFormatter)
  }

  /**
   * Idempotently deploys the AlgohubCampaignFactory smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  public deploy(params: AlgohubCampaignFactoryDeployArgs & AppClientDeployCoreParams = {}): ReturnType<ApplicationClient['deploy']> {
    const createArgs = params.createCall?.(AlgohubCampaignFactoryCallFactory.create)
    return this.appClient.deploy({
      ...params,
      createArgs,
      createOnCompleteAction: createArgs?.onCompleteAction,
    })
  }

  /**
   * Gets available create methods
   */
  public get create() {
    const $this = this
    return {
      /**
       * Creates a new instance of the AlgohubCampaignFactory smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The create result
       */
      bare(args: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs & (OnCompleteOptIn)): Promise<AppCallTransactionResultOfType<undefined>> {
        return $this.appClient.create(args) as unknown as Promise<AppCallTransactionResultOfType<undefined>>
      },
      /**
       * Creates a new instance of the AlgohubCampaignFactory smart contract using the createApplication()void ABI method.
       *
       * @param args The arguments for the smart contract call
       * @param params Any additional parameters for the call
       * @returns The create result
       */
      async createApplication(args: MethodArgs<'createApplication()void'>, params: AppClientCallCoreParams & AppClientCompilationParams & (OnCompleteNoOp) = {}): Promise<AppCallTransactionResultOfType<MethodReturn<'createApplication()void'>>> {
        return $this.mapReturnValue(await $this.appClient.create(AlgohubCampaignFactoryCallFactory.create.createApplication(args, params)))
      },
    }
  }

  /**
   * Makes a clear_state call to an existing instance of the AlgohubCampaignFactory smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The clear_state result
   */
  public clearState(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.appClient.clearState(args)
  }

  /**
   * Calls the createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64 ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public createCampaign(args: MethodArgs<'createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(AlgohubCampaignFactoryCallFactory.createCampaign(args, params))
  }

  /**
   * Calls the getAllCampaignApps()uint64[] ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public getAllCampaignApps(args: MethodArgs<'getAllCampaignApps()uint64[]'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(AlgohubCampaignFactoryCallFactory.getAllCampaignApps(args, params))
  }

  /**
   * Extracts a binary state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns A BinaryState instance containing the state value, or undefined if the key was not found
   */
  private static getBinaryState(state: AppState, key: string): BinaryState | undefined {
    const value = state[key]
    if (!value) return undefined
    if (!('valueRaw' in value))
      throw new Error(`Failed to parse state value for ${key}; received an int when expected a byte array`)
    return {
      asString(): string {
        return value.value
      },
      asByteArray(): Uint8Array {
        return value.valueRaw
      }
    }
  }

  /**
   * Extracts a integer state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns An IntegerState instance containing the state value, or undefined if the key was not found
   */
  private static getIntegerState(state: AppState, key: string): IntegerState | undefined {
    const value = state[key]
    if (!value) return undefined
    if ('valueRaw' in value)
      throw new Error(`Failed to parse state value for ${key}; received a byte array when expected a number`)
    return {
      asBigInt() {
        return typeof value.value === 'bigint' ? value.value : BigInt(value.value)
      },
      asNumber(): number {
        return typeof value.value === 'bigint' ? Number(value.value) : value.value
      },
    }
  }

  /**
   * Returns the smart contract's global state wrapped in a strongly typed accessor with options to format the stored value
   */
  public async getGlobalState(): Promise<AlgohubCampaignFactory['state']['global']> {
    const state = await this.appClient.getGlobalState()
    return {
      get algohubCampaigns() {
        return AlgohubCampaignFactoryClient.getBinaryState(state, 'algohubCampaigns')
      },
    }
  }

  public compose(): AlgohubCampaignFactoryComposer {
    const client = this
    const atc = new AtomicTransactionComposer()
    let promiseChain:Promise<unknown> = Promise.resolve()
    const resultMappers: Array<undefined | ((x: any) => any)> = []
    return {
      createCampaign(args: MethodArgs<'createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.createCampaign(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      getAllCampaignApps(args: MethodArgs<'getAllCampaignApps()uint64[]'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.getAllCampaignApps(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      clearState(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.clearState({...args, sendParams: {...args?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom) {
        promiseChain = promiseChain.then(async () => atc.addTransaction(await algokit.getTransactionWithSigner(txn, defaultSender ?? client.sender)))
        return this
      },
      async atc() {
        await promiseChain
        return atc
      },
      async execute() {
        await promiseChain
        const result = await algokit.sendAtomicTransactionComposer({ atc, sendParams: {} }, client.algod)
        return {
          ...result,
          returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue)
        }
      }
    } as unknown as AlgohubCampaignFactoryComposer
  }
}
export type AlgohubCampaignFactoryComposer<TReturns extends [...any[]] = []> = {
  /**
   * Calls the createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64 ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  createCampaign(args: MethodArgs<'createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64'>, params?: AppClientCallCoreParams & CoreAppCallArgs): AlgohubCampaignFactoryComposer<[...TReturns, MethodReturn<'createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)uint64'>]>

  /**
   * Calls the getAllCampaignApps()uint64[] ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  getAllCampaignApps(args: MethodArgs<'getAllCampaignApps()uint64[]'>, params?: AppClientCallCoreParams & CoreAppCallArgs): AlgohubCampaignFactoryComposer<[...TReturns, MethodReturn<'getAllCampaignApps()uint64[]'>]>

  /**
   * Makes a clear_state call to an existing instance of the AlgohubCampaignFactory smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  clearState(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs): AlgohubCampaignFactoryComposer<[...TReturns, undefined]>

  /**
   * Adds a transaction to the composer
   *
   * @param txn One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by one of algokit utils helpers (signer is obtained from the defaultSender parameter)
   * @param defaultSender The default sender to be used to obtain a signer where the object provided to the transaction parameter does not include a signer.
   */
  addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom): AlgohubCampaignFactoryComposer<TReturns>
  /**
   * Returns the underlying AtomicTransactionComposer instance
   */
  atc(): Promise<AtomicTransactionComposer>
  /**
   * Executes the transaction group and returns an array of results
   */
  execute(): Promise<AlgohubCampaignFactoryComposerResults<TReturns>>
}
export type AlgohubCampaignFactoryComposerResults<TReturns extends [...any[]]> = {
  returns: TReturns
  groupId: string
  txIds: string[]
  transactions: Transaction[]
}
