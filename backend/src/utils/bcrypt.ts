import bcrypt from 'bcrypt';
const saltRounds = 10;

export async function generateHash(password: string): Promise<string> {
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

export async function compareHash(
    password: string,
    hash: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}
