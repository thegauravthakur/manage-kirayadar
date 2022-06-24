import bcrypt from 'bcrypt';
const saltRounds = 10;

export async function generatePasswordHash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) reject(err);
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });
    });
}
